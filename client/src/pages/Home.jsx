import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Crown, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { api } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    setPageMeta({ title: 'Luxury Perfumes in Owerri', description: 'Shop original designer Arabian fragrances, oil perfumes, body mists, diffusers, humidifiers, gift sets, and premium scents from Roc Realm Perfumes in Owerri.' });
    api.get('/products?featured=true').then((res) => setProducts(res.data.products)).catch(() => setProducts([]));
    api.get('/testimonials').then((res) => setTestimonials(res.data.testimonials)).catch(() => setTestimonials([]));
  }, []);

  return (
    <main>
      <section className="luxury-gradient relative overflow-hidden text-white">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-5 inline-flex rounded-full border border-amber-300/30 px-4 py-2 text-sm text-amber-200">Perfumes, oils, mists, diffusers and humidifiers</p>
            <h1 className="font-display text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">Shop your next scent.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-200">Browse available products, order online, or chat with us on WhatsApp.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-4 font-semibold text-stone-950 hover:bg-amber-300">Shop Collection <ArrowRight size={18} /></Link>
              <Link to="/contact" className="rounded-full border border-white/20 px-7 py-4 font-semibold text-white hover:bg-white/10">Ask for Consultation</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [Crown, 'Good Scents', 'Perfumes, oils, mists and home fragrance.'],
            [ShieldCheck, 'Easy Order', 'Add to cart or order on WhatsApp.'],
            [Truck, 'Delivery', 'Delivery and pickup options.'],
            [Sparkles, 'Gift Options', 'Scents and sets for gifting.'],
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-[2rem] border border-amber-900/10 bg-white p-6 shadow-sm">
              <Icon className="text-amber-700" />
              <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Featured</p>
            <h2 className="font-display text-4xl font-semibold">Signature Picks</h2>
          </div>
          <Link to="/shop" className="font-semibold text-amber-800">View all products</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="luxury-gradient rounded-[2.5rem] p-8 text-white md:p-12">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Quick search</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">Shop popular picks.</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['Fresh', 'Sweet', 'Oud', 'Gift'].map((mood) => <Link key={mood} to={`/shop?search=${encodeURIComponent(mood)}`} className="rounded-2xl bg-white/10 p-5 font-semibold text-amber-100 transition hover:bg-white/15">{mood}</Link>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          {testimonials.length > 0 && <><div><p className="text-sm uppercase tracking-[0.3em] text-amber-700">Reviews</p><h2 className="mt-3 font-display text-4xl font-semibold">Customer feedback.</h2></div><div className="grid gap-4 md:grid-cols-3">{testimonials.slice(0, 3).map((item) => <div key={`${item.name}-${item.quote}`} className="rounded-[2rem] bg-white p-6 shadow-sm"><p className="text-amber-600">{'★'.repeat(item.rating || 5)}</p><p className="mt-3 text-sm leading-6 text-stone-600">“{item.quote}”</p><strong className="mt-4 block">{item.name}</strong><span className="text-xs text-stone-500">{item.location}</span></div>)}</div></>}
        </div>
      </section>
    </main>
  );
}
