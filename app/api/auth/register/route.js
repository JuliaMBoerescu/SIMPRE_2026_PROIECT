import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: 'Completează toate câmpurile.' }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: 'Parola trebuie să aibă minim 6 caractere.' }, { status: 400 });

  const db = await getDb();
  const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
  if (existing) return NextResponse.json({ error: 'Există deja un cont cu acest email.' }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { name, email: email.toLowerCase(), passwordHash, role: 'user', createdAt: new Date() };
  const result = await db.collection('users').insertOne(user);
  user._id = result.insertedId;
  await setAuthCookie(signToken(user));
  return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}
