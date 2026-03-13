import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

// POST — upload image to Supabase Storage using service role
export async function POST(request) {
  const supabase = getSupabaseServerClient();

  const formData = await request.formData();
  const file = formData.get('file');
  const productId = formData.get('productId');

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Generate unique filename
  const ext = file.name.split('.').pop();
  const timestamp = Date.now();
  const filePath = `${productId}/${timestamp}.${ext}`;

  // Convert to buffer for upload
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl });
}
