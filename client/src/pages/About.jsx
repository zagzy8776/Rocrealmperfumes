import { businessInfo } from '../lib/api.js';

export default function About() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">About</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Luxury fragrance, home scent, and everyday confidence.</h1>
      <p className="mt-6 text-lg leading-8 text-stone-600">{businessInfo.brand} is built for customers who want quality scents, original designer Arabian fragrances, and elegant home fragrance essentials. From oil perfumes and body mists to diffusers and humidifiers, the store helps customers shop confidently through a smooth WhatsApp-first experience.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {['Designer Arabian fragrances', 'Oil perfumes and body mists', 'Diffusers, humidifiers, and WhatsApp support'].map((item) => <div key={item} className="rounded-[2rem] bg-white p-6 font-semibold shadow-sm">{item}</div>)}
      </div>
    </main>
  );
}
