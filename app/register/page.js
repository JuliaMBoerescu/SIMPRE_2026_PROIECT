'use client';
import { useState } from 'react';
import Link from 'next/link';
export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setError('');
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Eroare register');
    location.href = '/';
  }
  return <main className="auth"><form onSubmit={submit} className="panel"><h1>Cont nou</h1>{error && <p className="error">{error}</p>}<input placeholder="Nume" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/><input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/><input type="password" placeholder="Parolă" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/><button>Register</button><p>Ai cont? <Link href="/login">Login</Link></p></form></main>;
}
