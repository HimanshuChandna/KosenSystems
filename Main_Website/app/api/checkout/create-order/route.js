import { NextResponse } from 'next/server';
import { getRazorpayInstance } from '@/lib/razorpay';

export async function POST(req) {
  try {
    const { amount, currency, items } = await req.json();
    const razorpay = getRazorpayInstance();

    const options = {
      amount: Math.round(amount * 100), // Razorpay amount is in paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        itemsCount: items.length,
        itemsSummary: items.map(i => `${i.name} x${i.quantity}`).join(', ').substring(0, 100)
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
