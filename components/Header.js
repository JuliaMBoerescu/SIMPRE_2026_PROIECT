'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', {
      method: 'POST'
    });

    setUser(null);
    window.location.href = '/login';
  }

  return (
    <header className="header">
      <Link href="/" className="logo">
        Azure Food Shop
      </Link>

      <nav>
        <Link href="/">Produse</Link>
        <Link href="/cart">Coș</Link>
        <Link href="/orders">Comenzi</Link>

        {user ? (
          <>
            <span> Welcome, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}