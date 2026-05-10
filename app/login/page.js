'use client';
import { useState } from 'react';
import Link from 'next/link';
export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setError('');
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Eroare login');
    location.href = '/';
  }
  return <main className="auth"><form onSubmit={submit} className="panel"><h1>Autentificare</h1>{error && <p className="error">{error}</p>}<input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/><input type="password" placeholder="Parolă" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/><button>Login</button><p>Nu ai cont? <Link href="/register">Creează cont</Link></p></form></main>;
}
