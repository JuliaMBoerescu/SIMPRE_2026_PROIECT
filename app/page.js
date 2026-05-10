'use client';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Toate');
  useEffect(() => {
  async function loadProducts() {
    try {
      const res = await fetch('/api/products');

      if (!res.ok) {
        console.error('Products API error:', res.status);
        return;
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : { products: [] };

      setProducts(data.products || []);
    } catch (error) {
      console.error('Could not load products:', error);
    }
  }

  loadProducts();
}, []);
  const categories = ['Toate', ...new Set(products.map(p => p.category))];
  const shown = category === 'Toate' ? products : products.filter(p => p.category === category);

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = cart.find(i => i.productId === product._id);
    if (found) found.quantity += 1; else cart.push({ productId: product._id, name: product.name, price: product.price, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produs adăugat în coș.');
  }

  return <main className="container">
    <section className="hero">
      <h1>Magazin online cu produse locale</h1>
      <p>Produse alimentare realizate in-house și gestionate prin servicii cloud Azure.</p>
    </section>
    <div className="filters">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? 'active' : ''}>{c}</button>)}</div>
    <section className="grid">
      {shown.map(p => <article className="card" key={p._id}>
        <img src={p.imageUrl || '/placeholder.svg'} alt={p.name} />
        <small>{p.category}</small>
        <h3>{p.name}</h3>
        <p>{p.description}</p>
        <div className="row"><b>{p.price} lei</b><span>Stoc: {p.stock}</span></div>
        <button onClick={() => addToCart(p)}>Adaugă în coș</button>
      </article>)}
    </section>
  </main>;
}
