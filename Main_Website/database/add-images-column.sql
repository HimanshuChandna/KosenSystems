-- =============================================
-- Add images column to products table
-- Run this in your Supabase SQL Editor
-- =============================================

-- Add images array column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
