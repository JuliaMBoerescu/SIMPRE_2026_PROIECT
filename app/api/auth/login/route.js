import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();
  const db = await getDb();
  const user = await db.collection('users').findOne({ email: email?.toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
    return NextResponse.json({ error: 'Email sau parolă incorectă.' }, { status: 401 });
  }
  await setAuthCookie(signToken(user));
  return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}
