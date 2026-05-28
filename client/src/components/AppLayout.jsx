import { Link, NavLink, Outlet } from 'react-router-dom';
import { CreditCard, Mail, MapPin, Menu, MessageCircle, PackageCheck, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { businessInfo, whatsappNumber } from '../lib/api.js';

const nav = [
  ['Home', '/'],
  ['Shop', '/shop'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const linkClass = ({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-amber-700' : 'text-stone-700 hover:text-amber-700'}`;

  return (
    <div className="min-h-screen bg-[#fffaf1] text-stone-900">
      <header className="sticky top-0 z-40 border-b border-amber-900/10 bg-[#fffaf1]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-950 text-amber-300"><Sparkles size={20} /></span>
            <span>
              <strong className="font-display text-xl tracking-wide">Roc Realm</strong>
              <span className="block text-xs uppercase tracking-[0.35em] text-amber-700">Perfumes</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map(([label, path]) => <NavLink key={path} to={path} className={linkClass}>{label}</NavLink>)}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative rounded-full border border-amber-900/20 p-3 hover:bg-amber-100">
              <ShoppingBag size={19} />
              {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-amber-600 px-1.5 text-xs font-bold text-white">{count}</span>}
            </Link>
            <button onClick={() => setOpen(!open)} className="rounded-full border border-amber-900/20 p-3 md:hidden"><Menu size={19} /></button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-amber-900/10 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {nav.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={linkClass}>{label}</NavLink>)}
            </div>
          </nav>
        )}
      </header>
      <Outlet />
      <footer className="bg-stone-950 text-stone-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h3 className="font-display text-2xl text-white">{businessInfo.name}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-400">Designer perfumes, oil perfumes, colognes, sprays, diffusers, humidifiers, nightwear, and lingeries curated for luxury everyday living.</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300">Quick Links</h4>
            <div className="mt-4 grid gap-2 text-sm text-stone-400">
              <Link to="/shop">Shop Collection</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300">Order Support</h4>
            <p className="mt-4 text-sm text-stone-400">Premium support for ordering, payment confirmation, delivery, and product consultation.</p>
            <div className="mt-5 grid gap-3 text-sm text-stone-300">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-amber-200"><MessageCircle size={17} className="text-green-400" /> WhatsApp: {businessInfo.phoneDisplay}</a>
              <a href={`mailto:${businessInfo.email}`} className="flex items-center gap-3 transition hover:text-amber-200"><Mail size={17} className="text-amber-300" /> Email support</a>
              <span className="flex items-center gap-3"><CreditCard size={17} className="text-amber-300" /> Bank transfer / pay on delivery</span>
              <span className="flex items-center gap-3"><PackageCheck size={17} className="text-amber-300" /> Order confirmation and tracking</span>
              <span className="flex items-center gap-3"><Truck size={17} className="text-amber-300" /> Delivery coordination in Owerri</span>
              <a href={businessInfo.mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-amber-200"><MapPin size={17} className="text-red-400" /> Get directions on Google Maps</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
