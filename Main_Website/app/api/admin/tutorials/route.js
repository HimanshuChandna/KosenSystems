import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

// GET all tutorials (including unpublished for admin)
export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PUT — update tutorial (publish/unpublish toggle, edit content)
export async function PUT(request) {
  const supabase = getSupabaseServerClient();
  const body = await request.json();
  const { id, created_at, updated_at, ...updates } = body;

  const { data, error } = await supabase
    .from('tutorials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — create a new tutorial
export async function POST(request) {
  const supabase = getSupabaseServerClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from('tutorials')
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — delete a tutorial
export async function DELETE(request) {
  const supabase = getSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await supabase.from('tutorials').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
