'use client';
import { useEffect, useState } from 'react';
export default function CartPage() {
  const [cart, setCart] = useState([]); const [message, setMessage] = useState('');
  useEffect(() => setCart(JSON.parse(localStorage.getItem('cart') || '[]')), []);
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  function save(next) { setCart(next); localStorage.setItem('cart', JSON.stringify(next)); }
  async function order() {
    setMessage('');
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart }) });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || 'Eroare comandă');
    localStorage.removeItem('cart'); setCart([]); setMessage('Comanda a fost plasată. Verifică emailul de confirmare.');
  }
  return <main className="container"><h1>Coșul meu</h1>{message && <p className="notice">{message}</p>}{cart.length === 0 ? <p>Coșul este gol.</p> : <div className="panel">{cart.map(i => <div className="cart-row" key={i.productId}><span>{i.name}</span><input type="number" min="1" value={i.quantity} onChange={e => save(cart.map(x => x.productId === i.productId ? { ...x, quantity: Number(e.target.value) } : x))}/><b>{i.price * i.quantity} lei</b><button onClick={() => save(cart.filter(x => x.productId !== i.productId))}>Șterge</button></div>)}<h2>Total: {total} lei</h2><button onClick={order}>Plasează comanda</button></div>}</main>;
}
