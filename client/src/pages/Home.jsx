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
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-5 inline-flex rounded-full border border-amber-300/30 px-4 py-2 text-sm text-amber-200">Luxury fragrances and home scents in Owerri</p>
            <h1 className="font-display text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">Discover your signature scent and experience luxury that lingers.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-200">Roc Realm Perfumes offers original designer Arabian fragrances, oil perfumes, body mists, diffusers, humidifiers, and premium scents carefully curated for confident everyday living.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-4 font-semibold text-stone-950 hover:bg-amber-300">Shop Collection <ArrowRight size={18} /></Link>
              <Link to="/contact" className="rounded-full border border-white/20 px-7 py-4 font-semibold text-white hover:bg-white/10">Ask for Consultation</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="glass-card rounded-[3rem] p-5">
            <img className="h-[32rem] w-full rounded-[2.4rem] object-cover" src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80" alt="Luxury perfume bottles" />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [Crown, 'Premium Selection', 'Designer fragrances, perfume oils, body mists, and home scents.'],
            [ShieldCheck, 'Quality First', 'Every item selected with care.'],
            [Truck, 'Owerri Delivery', 'Fast local order coordination.'],
            [Sparkles, 'Gift Ready', 'Perfect fragrance, diffuser, and home scent gifts.'],
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
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Shop by mood</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">Find the perfect scent for every moment.</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['Fresh office scent', 'Sweet date night', 'Luxury oud mood', 'Gift-ready picks'].map((mood) => <Link key={mood} to={`/shop?search=${encodeURIComponent(mood.split(' ')[0])}`} className="rounded-2xl bg-white/10 p-5 font-semibold text-amber-100 transition hover:bg-white/15">{mood}</Link>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Trust</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">Why Owerri shoppers choose Roc Realm.</h2>
            <p className="mt-4 leading-8 text-stone-600">Premium product selection, WhatsApp consultation, fast order confirmation, and a luxury shopping feel from first click to delivery.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {(testimonials.length ? testimonials.slice(0, 3) : [
              { name: 'Happy Customer', quote: 'The scent recommendation was perfect and delivery was smooth.', location: 'Owerri', rating: 5 },
              { name: 'Gift Buyer', quote: 'Beautiful perfume options and quick WhatsApp confirmation.', location: 'Imo State', rating: 5 },
              { name: 'Roc Realm Client', quote: 'Premium service and lovely fragrance choices.', location: 'Nigeria', rating: 5 },
            ]).map((item) => <div key={`${item.name}-${item.quote}`} className="rounded-[2rem] bg-white p-6 shadow-sm"><p className="text-amber-600">{'★'.repeat(item.rating || 5)}</p><p className="mt-3 text-sm leading-6 text-stone-600">“{item.quote}”</p><strong className="mt-4 block">{item.name}</strong><span className="text-xs text-stone-500">{item.location}</span></div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
