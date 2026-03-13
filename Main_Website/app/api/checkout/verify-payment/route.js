import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      shipping_info,
      items,
      total
    } = await req.json();

    // 1. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Save Order to Supabase
    const supabase = getSupabaseServerClient();
    
    // We should first check if there's a logged in user, but for now we'll store as guest if not
    // In a real app, we'd get user_id from auth
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        razorpay_order_id,
        razorpay_payment_id,
        customer_name: shipping_info.name,
        customer_email: shipping_info.email,
        customer_phone: shipping_info.phone,
        shipping_address: `${shipping_info.address}, ${shipping_info.city}, ${shipping_info.state} - ${shipping_info.pincode}`,
        items: items,
        total: total,
        order_status: 'placed',
        payment_status: 'paid'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order Save Error:', orderError);
      // We don't return error here because payment was successful, we should log it for manual intervention
    }

    return NextResponse.json({ 
      success: true, 
      order_id: order?.id || 'manual_review_needed' 
    });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
