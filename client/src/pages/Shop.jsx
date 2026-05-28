import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    api.get(`/products?${params.toString()}`).then((res) => setProducts(res.data.products)).catch(() => setProducts([]));
  }, [category, search]);

  const sorted = useMemo(() => [...products].sort((a, b) => {
    const ap = Number(a.salePrice || a.price);
    const bp = Number(b.salePrice || b.price);
    if (sort === 'low') return ap - bp;
    if (sort === 'high') return bp - ap;
    return 0;
  }), [products, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] bg-stone-950 p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Shop</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Luxury Collection</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Browse designer perfumes, oil perfumes, colognes, sprays, diffusers, humidifiers, nightwear, lingeries, and gift-ready selections.</p>
      </div>

      <div className="mt-8 grid gap-4 rounded-[2rem] border border-amber-900/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px]">
        <label className="flex items-center gap-3 rounded-full bg-stone-100 px-4">
          <Search size={18} className="text-stone-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search perfumes, diffusers, nightwear..." className="w-full bg-transparent py-3 outline-none" />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">
          <option value="">All categories</option>
          {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">
          <option value="new">Newest</option>
          <option value="low">Price: Low</option>
          <option value="high">Price: High</option>
        </select>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sorted.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {!sorted.length && <p className="py-20 text-center text-stone-500">No products found.</p>}
    </main>
  );
}
