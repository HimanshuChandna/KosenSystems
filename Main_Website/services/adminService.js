import { getSupabaseServerClient } from '@/lib/supabase-server';

// ========================
// Admin Service (Server-side, uses service role key)
// ========================

// --- Products ---
export async function adminGetAllProducts() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminCreateProduct(product) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function adminUpdateProduct(id, updates) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function adminDeleteProduct(id) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// --- Orders ---
export async function adminGetAllOrders() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminUpdateOrderStatus(id, status) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- Categories ---
export async function adminGetAllCategories() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

// --- Tutorials ---
export async function adminGetAllTutorials() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// --- Dashboard Stats ---
export async function adminGetDashboardStats() {
  const supabase = getSupabaseServerClient();

  const [productsRes, ordersRes, categoriesRes, tutorialsRes] = await Promise.all([
    supabase.from('products').select('id, price, stock, in_stock', { count: 'exact' }),
    supabase.from('orders').select('id, total, order_status, payment_status', { count: 'exact' }),
    supabase.from('categories').select('id', { count: 'exact' }),
    supabase.from('tutorials').select('id', { count: 'exact' }),
  ]);

  const products = productsRes.data || [];
  const orders = ordersRes.data || [];

  const totalRevenue = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total), 0);

  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  return {
    productCount: productsRes.count || products.length,
    orderCount: ordersRes.count || orders.length,
    categoryCount: categoriesRes.count || 0,
    tutorialCount: tutorialsRes.count || 0,
    totalRevenue,
    totalStock,
    pendingOrders: orders.filter(o => o.order_status === 'placed' || o.order_status === 'confirmed').length,
    shippedOrders: orders.filter(o => o.order_status === 'shipped').length,
  };
}
