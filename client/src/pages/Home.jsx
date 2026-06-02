import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { api } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';

const HOME_PRODUCTS_PER_BATCH = 10;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setPageMeta({ title: 'Roc Realm Perfumes', description: 'Shop perfumes, oils, body mists, diffusers, humidifiers, and gift items from Roc Realm Perfumes.' });
    api.get(`/products?page=1&limit=${HOME_PRODUCTS_PER_BATCH}`).then((res) => {
      setProducts(res.data.products);
      setPagination(res.data.pagination || { total: res.data.products.length, hasMore: false });
    }).catch(() => { setProducts([]); setPagination({ total: 0, hasMore: false }); });
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => setCategories([]));
  }, []);

  const loadMoreProducts = async () => {
    if (loadingMore || !pagination.hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await api.get(`/products?page=${nextPage}&limit=${HOME_PRODUCTS_PER_BATCH}`);
      setProducts((current) => [...current, ...res.data.products]);
      setPagination(res.data.pagination || { total: products.length + res.data.products.length, hasMore: false });
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main>
      <section className="luxury-gradient relative overflow-hidden text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 inline-flex rounded-full border border-amber-300/30 px-4 py-2 text-sm text-amber-200">Roc Realm Perfumes</p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">Perfumes. Oils. Mists. Diffusers.</h1>
            <p className="mt-4 max-w-xl text-base text-stone-200 sm:text-lg">See what we sell and order fast.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-stone-950 hover:bg-amber-300">Shop now <ArrowRight size={18} /></Link>
              <Link to="/contact" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10">WhatsApp us</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Link to="/shop" className="shrink-0 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">All Products</Link>
          {categories.slice(0, 10).map((category) => (
            <Link key={category.id} to={`/shop?category=${category.slug}`} className="shrink-0 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-amber-900/10">{category.name}</Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Shop</p>
            <h2 className="font-display text-4xl font-semibold">Available Products</h2>
          </div>
          <Link to="/shop" className="font-semibold text-amber-800">View all products</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {pagination.hasMore && (
          <div className="mt-10 text-center">
            <button disabled={loadingMore} onClick={loadMoreProducts} className="rounded-full bg-stone-950 px-8 py-4 font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loadingMore ? 'Loading...' : 'View more products'}
            </button>
            <p className="mt-3 text-sm text-stone-500">Showing {products.length} of {pagination.total}</p>
          </div>
        )}
        {!products.length && <p className="rounded-[2rem] bg-white p-10 text-center text-stone-500">No products yet. Add products from the admin panel.</p>}
      </section>
    </main>
  );
}
