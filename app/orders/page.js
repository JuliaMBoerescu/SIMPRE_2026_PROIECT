'use client';
import { useEffect, useState } from 'react';
export default function OrdersPage() {
  const [orders, setOrders] = useState([]); const [error, setError] = useState('');
  useEffect(() => { fetch('/api/orders').then(async r => { const d = await r.json(); if (!r.ok) setError(d.error); else setOrders(d.orders || []); }); }, []);
  return <main className="container"><h1>Comenzile mele</h1>{error && <p className="error">{error}</p>}{orders.map(o => <article className="panel" key={o._id}><h3>Comanda #{o._id}</h3><p>Status: {o.status}</p><ul>{o.items.map(i => <li key={i.productId}>{i.name} x {i.quantity} - {i.price * i.quantity} lei</li>)}</ul><b>Total: {o.total} lei</b></article>)}</main>;
}
