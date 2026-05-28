import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Crown, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { api } from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products?featured=true').then((res) => setProducts(res.data.products)).catch(() => setProducts([]));
  }, []);

  return (
    <main>
      <section className="luxury-gradient relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-5 inline-flex rounded-full border border-amber-300/30 px-4 py-2 text-sm text-amber-200">Luxury scents, lifestyle pieces, and home fragrance in Owerri</p>
            <h1 className="font-display text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">Discover your signature realm of fragrance and luxury.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-200">Roc Realm Perfumes offers designer perfumes, oil perfumes, colognes, sprays, diffusers, humidifiers, nightwear, and lingeries for confident everyday living.</p>
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
            [Crown, 'Premium Selection', 'Designer perfumes, oils, colognes, and lifestyle pieces.'],
            [ShieldCheck, 'Quality First', 'Every item selected with care.'],
            [Truck, 'Owerri Delivery', 'Fast local order coordination.'],
            [Sparkles, 'Gift Ready', 'Perfect fragrance, diffuser, and lifestyle gifts.'],
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
    </main>
  );
}
