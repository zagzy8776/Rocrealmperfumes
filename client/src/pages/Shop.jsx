import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';

const PRODUCTS_PER_BATCH = 18;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');
  const [availability, setAvailability] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });
  const [loadingMore, setLoadingMore] = useState(false);


  useEffect(() => {
    setPageMeta({ title: 'Shop Perfumes', description: 'Browse Roc Realm Perfumes collection: original designer Arabian fragrances, oil perfumes, body mists, diffusers, humidifiers, gift sets, and home scents in Owerri.' });
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    params.set('page', '1');
    params.set('limit', String(PRODUCTS_PER_BATCH));

    setPage(1);
    api.get(`/products?${params.toString()}`).then((res) => {
      setProducts(res.data.products);
      setPagination(res.data.pagination || { total: res.data.products.length, hasMore: false });
    }).catch(() => { setProducts([]); setPagination({ total: 0, hasMore: false }); });
  }, [category, search]);

  const loadMoreProducts = async () => {
    if (loadingMore || !pagination.hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('page', String(nextPage));
      params.set('limit', String(PRODUCTS_PER_BATCH));
      const res = await api.get(`/products?${params.toString()}`);
      setProducts((current) => [...current, ...res.data.products]);
      setPagination(res.data.pagination || { total: products.length + res.data.products.length, hasMore: false });
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  };


  const sorted = useMemo(() => products.filter((product) => availability === 'all' ? true : product.stock > 0).sort((a, b) => {
    const ap = Number(a.salePrice || a.price);
    const bp = Number(b.salePrice || b.price);
    if (sort === 'low') return ap - bp;
    if (sort === 'high') return bp - ap;
    return 0;
  }), [products, sort, availability]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] bg-stone-950 p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Shop</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Luxury Collection</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Browse original designer Arabian fragrances, oil perfumes, body mists, sprays, diffusers, humidifiers, and gift-ready selections.</p>
      </div>

      <div className="mt-8 grid gap-4 rounded-[2rem] border border-amber-900/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px_180px]">
        <label className="flex items-center gap-3 rounded-full bg-stone-100 px-4">
          <Search size={18} className="text-stone-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search perfumes, body mists, diffusers..." className="w-full bg-transparent py-3 outline-none" />
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
        <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">
          <option value="all">All stock</option>
          <option value="available">Available only</option>
        </select>
      </div>

      <div className="mt-4 grid gap-3 rounded-[2rem] bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
      </div>


      <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {sorted.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {pagination.hasMore && (
        <div className="mt-10 text-center">
          <button disabled={loadingMore} onClick={loadMoreProducts} className="rounded-full bg-stone-950 px-8 py-4 font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loadingMore ? 'Loading...' : 'View more products'}
          </button>
          <p className="mt-3 text-sm text-stone-500">Showing {products.length} of {pagination.total}</p>
        </div>
      )}
      {!sorted.length && <p className="py-20 text-center text-stone-500">No products found.</p>}
    </main>
  );
}
