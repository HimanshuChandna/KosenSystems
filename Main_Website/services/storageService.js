import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

const BUCKET_NAME = 'product-images';

/**
 * Upload a product image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} productId - The product ID for organizing images
 * @returns {string} The public URL of the uploaded image
 */
export async function uploadProductImage(file, productId) {
  const supabase = getSupabaseBrowserClient();

  // Generate unique filename
  const ext = file.name.split('.').pop();
  const timestamp = Date.now();
  const filePath = `${productId}/${timestamp}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Upload multiple product images
 * @param {FileList|File[]} files
 * @param {string} productId
 * @returns {string[]} Array of public URLs
 */
export async function uploadProductImages(files, productId) {
  const urls = [];
  for (const file of files) {
    const url = await uploadProductImage(file, productId);
    urls.push(url);
  }
  return urls;
}

/**
 * Delete a product image from Supabase Storage
 * @param {string} imageUrl - The public URL of the image
 */
export async function deleteProductImage(imageUrl) {
  const supabase = getSupabaseBrowserClient();

  // Extract the file path from the public URL
  const urlParts = imageUrl.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
  if (urlParts.length < 2) return;

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) throw error;
}

/**
 * Get the public URL for a product image path
 */
export function getImageUrl(path) {
  const supabase = getSupabaseBrowserClient();
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);
  return publicUrl;
}
