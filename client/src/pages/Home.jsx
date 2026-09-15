import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { api, businessInfo } from '../lib/api.js';
import { setPageMeta, setOrganizationStructuredData, setFAQStructuredData, setItemListStructuredData } from '../lib/seo.js';
import { HOME_FAQ_ITEMS } from '../lib/faq.js';
import { SERVICE_AREA_LINKS } from '../lib/locations.js';
import { LOCATION_KEYWORD_LINE, LOCATION_KEYWORDS, TRENDING_KEYWORD_LINE, TRENDING_NOTES, TRENDING_PERFUME_KEYWORDS } from '../lib/keywords.js';
import ProductCard from '../components/ProductCard.jsx';
import Testimonials from '../components/Testimonials.jsx';

const HOME_PRODUCTS_PER_BATCH = 12;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, hasMore: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageMeta({
      title: 'Best Perfume Store in Owerri, Imo State',
      description: 'Perfume store in Owerri, Imo State: original designer, Arabian and oil perfumes, body mists, diffusers and gift sets. Delivery in Owerri and nationwide.',
      keywords: [...LOCATION_KEYWORDS.owerri, ...LOCATION_KEYWORDS.imo, ...TRENDING_PERFUME_KEYWORDS].join(', ')
    });
    setOrganizationStructuredData();
    setFAQStructuredData(HOME_FAQ_ITEMS);
    fetchProducts(1, false);
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => setCategories([]));
  }, []);

  const fetchProducts = async (targetPage = 1, shouldScroll = true) => {
    setLoading(true);
    try {
      const res = await api.get(`/products?page=${targetPage}&limit=${HOME_PRODUCTS_PER_BATCH}`);
      setProducts(res.data.products);
      setItemListStructuredData(res.data.products, 'Trending perfumes in Owerri, Imo State');
      setPagination(res.data.pagination || { total: res.data.products.length, totalPages: 1, hasMore: false });
      setPage(targetPage);
      if (shouldScroll) document.getElementById('home-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      setProducts([]);
      setPagination({ total: 0, totalPages: 1, hasMore: false });
    } finally {
      setLoading(false);
    }
  };

  const pageNumbers = useMemo(() => {
    const totalPages = Math.max(1, pagination.totalPages || 1);
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, pagination.totalPages]);

  return (
    <main>
      <section className="luxury-gradient relative overflow-hidden text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 inline-flex rounded-full border border-amber-300/30 px-4 py-2 text-sm text-amber-200">Roc Realm Perfumes</p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">Best Perfume Store in Owerri, Imo State - Discover Your Signature Scent</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-200 sm:text-lg">Roc Realm Perfumes offers original designer perfumes, Arabian fragrances, vanilla gourmand, pistachio, aquatic, jasmine, vetiver perfumes, body mists, diffusers, humidifiers, and premium scents. Delivery to Port Harcourt, Onitsha, Anambra, Enugu. Shop trending unisex fragrances.</p>
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

      <section id="home-products" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Shop</p>
            <h2 className="font-display text-4xl font-semibold">Available Products</h2>
          </div>
          <Link to="/shop" className="font-semibold text-amber-800">View all products</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {loading && <p className="py-8 text-center text-stone-500">Loading products...</p>}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button disabled={loading || page <= 1} onClick={() => fetchProducts(page - 1)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-amber-900/10 disabled:cursor-not-allowed disabled:opacity-40">
              Previous
            </button>
            {pageNumbers.map((pageNumber) => (
              <button key={pageNumber} disabled={loading} onClick={() => fetchProducts(pageNumber)} className={`h-11 w-11 rounded-full text-sm font-bold shadow-sm ${pageNumber === page ? 'bg-stone-950 text-white' : 'bg-white text-stone-800 ring-1 ring-amber-900/10'}`}>
                {pageNumber}
              </button>
            ))}
            <button disabled={loading || page >= pagination.totalPages} onClick={() => fetchProducts(page + 1)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-amber-900/10 disabled:cursor-not-allowed disabled:opacity-40">
              Next
            </button>
            <p className="w-full text-center text-sm text-stone-500">Page {page} of {pagination.totalPages} · {pagination.total} products</p>
          </div>
        )}
        {!products.length && !loading && <p className="rounded-[2rem] bg-white p-10 text-center text-stone-500">No products yet. Add products from the admin panel.</p>}
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Trending Now</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">Trending perfume notes in Owerri and Nigeria</h2>
          <p className="mt-4 max-w-3xl leading-8 text-stone-600">
            The scents customers request most in Owerri, Imo State are {TRENDING_KEYWORD_LINE}. We also stock designer and Arabian fragrances built on pistachio, caramel, coconut, cherry, jasmine, amber, oud and white musk. Tell us the notes you love and we will match them to perfumes in stock.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {TRENDING_NOTES.slice(0, 18).map((note) => (
              <li key={note} className="rounded-full bg-amber-50 px-4 py-2 text-sm capitalize text-amber-900">{note}</li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/fragrance-glossary" className="rounded-full bg-stone-950 px-6 py-3 font-semibold text-white">Fragrance glossary</Link>
            <Link to="/shop" className="rounded-full bg-amber-100 px-6 py-3 font-semibold text-amber-900">Shop trending perfumes</Link>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Delivery Areas</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">Perfume delivery across the South East and beyond</h2>
          <p className="mt-4 max-w-3xl leading-8 text-stone-600">
            Roc Realm Perfumes is based at {businessInfo.fullAddress}, open {businessInfo.openingHours}. Owerri delivery is 3,000 naira, pickup from our Uratta store is free, and park dispatch or waybill is 1,000 naira with any remaining cost confirmed before we send your parcel.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICE_AREA_LINKS.map((area) => (
              <li key={area.slug}>
                <Link to={area.path} className="block h-full rounded-[1.5rem] bg-amber-50 p-5 transition hover:bg-amber-100">
                  <strong className="block font-display text-xl text-stone-950">Perfume shop in {area.city}</strong>
                  <span className="mt-2 block text-sm text-stone-600">{area.state}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-stone-600">
            Prefer to talk first? Call <a href={`tel:${businessInfo.callLine}`} className="font-semibold text-amber-800">{businessInfo.callLine}</a> or send us a WhatsApp message for a scent recommendation.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">FAQ</p>
        <h2 className="mt-3 font-display text-4xl font-semibold">Questions customers ask before ordering</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {HOME_FAQ_ITEMS.slice(0, 8).map((item) => (
            <article key={item.question} className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-stone-950">{item.question}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">{item.answer}</p>
            </article>
          ))}
        </div>
        <Link to="/faq" className="mt-6 inline-block font-semibold text-amber-800">Read all perfume FAQs</Link>
      </section>
    </main>
  );
}
