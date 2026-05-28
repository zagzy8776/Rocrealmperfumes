import { Mail, MapPin, MessageCircle, Music2, Phone, Sparkles } from 'lucide-react';
import { businessInfo, whatsappNumber } from '../lib/api.js';

export default function Contact() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Contact</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Talk to Roc Realm Perfumes</h1>
      <p className="mt-4 text-stone-600">Order designer perfumes, oil perfumes, colognes, sprays, diffusers, humidifiers, nightwear, and lingeries directly from Roc Realm Nigeria Limited.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-6 shadow-sm"><MessageCircle className="text-green-600" /><h2 className="mt-4 font-semibold">WhatsApp</h2><p className="text-stone-600">{businessInfo.phoneDisplay}</p></a>
        <a href={businessInfo.mapUrl} target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><MapPin className="text-amber-700" /><h2 className="mt-4 font-semibold">Location</h2><p className="text-stone-600">Owerri, Imo State. Click for Google Maps directions.</p></a>
        <a href={`tel:${businessInfo.phoneDisplay.replaceAll(' ', '')}`} className="rounded-[2rem] bg-white p-6 shadow-sm"><Phone className="text-amber-700" /><h2 className="mt-4 font-semibold">Phone</h2><p className="text-stone-600">{businessInfo.phoneDisplay}</p></a>
        <a href={`mailto:${businessInfo.email}`} className="rounded-[2rem] bg-white p-6 shadow-sm"><Mail className="text-amber-700" /><h2 className="mt-4 font-semibold">Email</h2><p className="break-words text-stone-600">{businessInfo.email}</p></a>
        <a href={businessInfo.instagramUrl} target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-6 shadow-sm"><Sparkles className="text-pink-600" /><h2 className="mt-4 font-semibold">Instagram</h2><p className="text-stone-600">{businessInfo.instagram}</p></a>
        <a href={businessInfo.tiktokUrl} target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-6 shadow-sm"><Music2 className="text-stone-900" /><h2 className="mt-4 font-semibold">TikTok</h2><p className="text-stone-600">{businessInfo.tiktok}</p></a>
      </div>
    </main>
  );
}
