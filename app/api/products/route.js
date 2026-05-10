import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = await getDb();

  const products = await db
    .collection('products')
    .find({ active: true })
    .toArray();

  products.sort((a, b) => {
    const categoryCompare = (a.category || '').localeCompare(b.category || '');
    if (categoryCompare !== 0) return categoryCompare;
    return (a.name || '').localeCompare(b.name || '');
  });

  return NextResponse.json({ products });
}