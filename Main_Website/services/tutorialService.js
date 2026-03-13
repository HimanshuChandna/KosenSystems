import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

const supabase = getSupabaseBrowserClient();

// ========================
// Tutorial Service
// ========================

export async function getAllTutorials() {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTutorialById(id) {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getTutorialsByProduct(productId) {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('product_id', productId)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
