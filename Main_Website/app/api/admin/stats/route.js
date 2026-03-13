import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

// GET dashboard statistics
export async function GET() {
  const supabase = getSupabaseServerClient();

  const [productsRes, ordersRes, categoriesRes, tutorialsRes] = await Promise.all([
    supabase.from('products').select('id, price, stock, in_stock'),
    supabase.from('orders').select('id, total, order_status, payment_status'),
    supabase.from('categories').select('id'),
    supabase.from('tutorials').select('id, published'),
  ]);

  const products = productsRes.data || [];
  const orders = ordersRes.data || [];
  const categories = categoriesRes.data || [];
  const tutorials = tutorialsRes.data || [];

  const totalRevenue = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  const pendingOrders = orders.filter(
    o => o.order_status === 'placed' || o.order_status === 'confirmed'
  ).length;

  return NextResponse.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    totalStock,
    totalCategories: categories.length,
    totalTutorials: tutorials.length,
    pendingOrders,
  });
}
