import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

const supabase = getSupabaseBrowserClient();

// ========================
// Order Service
// ========================

export async function createOrder(orderData) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user?.id || null,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      total: orderData.total,
      shipping_address: orderData.shippingAddress,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      notes: orderData.notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrderPayment(orderId, razorpayData) {
  const { data, error } = await supabase
    .from('orders')
    .update({
      razorpay_order_id: razorpayData.orderId,
      razorpay_payment_id: razorpayData.paymentId,
      payment_status: 'paid',
      order_status: 'confirmed',
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
