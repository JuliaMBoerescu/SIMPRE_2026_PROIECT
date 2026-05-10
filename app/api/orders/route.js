import { NextResponse } from 'next/server';
import { getDb, ObjectId } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendOrderEmail } from '@/lib/email';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Trebuie să fii autentificat pentru a vedea comenzile.' },
        { status: 401 }
      );
    }

    const db = await getDb();

    const userId = String(user._id || user.id);

    const orders = await db
      .collection('orders')
      .find({ userId })
      .toArray();

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders GET error:', error);

    return NextResponse.json(
      { error: 'Nu s-au putut încărca comenzile.' },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Trebuie să fii autentificat pentru a comanda.' }, { status: 401 });

  const { items } = await req.json();
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'Coșul este gol.' }, { status: 400 });

  const db = await getDb();
  const ids = items.map(i => new ObjectId(i.productId));
  const products = await db.collection('products').find({ _id: { $in: ids }, active: true }).toArray();

  const orderItems = items.map(i => {
    const product = products.find(p => p._id.toString() === i.productId);
    if (!product) throw new Error('Produs invalid.');
    const quantity = Math.max(1, Number(i.quantity || 1));
    return { productId: product._id.toString(), name: product.name, price: product.price, quantity };
  });

  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const order = { userId: user.id, userEmail: user.email, userName: user.name, items: orderItems, total, status: 'placed', createdAt: new Date() };
  const result = await db.collection('orders').insertOne(order);
  order._id = result.insertedId;

  await sendOrderEmail({ to: user.email, name: user.name, orderId: result.insertedId.toString(), total, items: orderItems });

  return NextResponse.json({ order });
}
