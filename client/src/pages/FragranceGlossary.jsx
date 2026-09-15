import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Leaf, Sparkles } from 'lucide-react';
import {
  FRAGRANCE_FORMATS,
  INTENT_KEYWORDS,
  TRENDING_NOTES,
  TRENDING_PERFUME_KEYWORDS,
  LOCATION_KEYWORD_LINE,
} from '../lib/keywords.js';
import { setPageMeta } from '../lib/seo.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

const FAMILIES = [
  ['Gourmand', 'Vanilla, pistachio, caramel, praline, almond, coffee and chocolate blends. Sweet, warm and currently the most requested family in Nigeria.'],
  ['Fresh and aquatic', 'Citrus, sea salt, mint and green tea. Light, clean and ideal for Nigerian heat and daytime wear.'],
  ['Floral', 'Jasmine, rose, orange blossom, gardenia, peony and ylang-ylang. Soft to bold, perfect for gifts.'],
  ['Woody and oud', 'Sandalwood, cedar, patchouli, vetiver and agarwood oud. Deep, long lasting and strong on projection.'],
  ['Amber and musk', 'Amber, tonka bean, white musk and ambergris. Skin-like, intimate and excellent for layering.'],
  ['Spicy and aromatic', 'Saffron, incense, tobacco, leather, lavender and cardamom. Rich, mature and evening focused.'],
];

const CONCENTRATIONS = [
  ['Parfum', 'Highest concentration. Lasts longest, sits closest to skin, best for evenings.'],
  ['Eau de parfum', 'The everyday luxury standard. Strong projection with all-day wear.'],
  ['Eau de toilette', 'Lighter and fresher. Great for hot afternoons and office wear.'],
  ['Perfume oil and attar', 'Alcohol free, roll-on, very long lasting on skin and travel friendly.'],
  ['Body and hair mist', 'Lightest option. Perfect for refreshing through the day or layering.'],
];

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Fragrance Glossary', path: '/fragrance-glossary' },
];

export default function FragranceGlossary() {
  useEffect(() => {
    setPageMeta({
      title: 'Fragrance Glossary | Perfume Notes and Terms',
      description: `Learn perfume notes, scent families and concentrations, plus trending terms such as ${TRENDING_PERFUME_KEYWORDS.slice(0, 5).join(', ')}. Buying original perfume in Owerri, Imo State with delivery to ${LOCATION_KEYWORD_LINE}.`,
      keywords: TRENDING_NOTES.slice(0, 20).join(', '),
    });
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={crumbs} />
      <section className="luxury-gradient mt-6 rounded-[2.5rem] p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Perfume Education</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Fragrance glossary</h1>
        <p className="mt-4 max-w-3xl text-stone-300">
          Perfume notes, scent families, concentrations and the trending terms customers ask us
          about in Owerri every week. Use it to describe exactly what you want before you order.
        </p>
      </section>

      <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3">
          <Leaf className="text-amber-700" aria-hidden="true" />
          <h2 className="font-display text-3xl font-semibold">Scent families explained</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {FAMILIES.map(([name, text]) => (
            <article key={name} className="rounded-2xl bg-amber-50 p-5">
              <h3 className="font-semibold text-stone-950">{name}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-700">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3">
          <Droplets className="text-amber-700" aria-hidden="true" />
          <h2 className="font-display text-3xl font-semibold">Concentrations and formats</h2>
        </div>
        <ol className="mt-6 grid gap-4">
          {CONCENTRATIONS.map(([name, text]) => (
            <li key={name} className="rounded-2xl bg-stone-50 p-5">
              <h3 className="font-semibold text-stone-950">{name}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-700">{text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-stone-600">
          We stock all of these formats: {FRAGRANCE_FORMATS.join(', ')}.
        </p>
      </section>

      <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3">
          <Sparkles className="text-amber-700" aria-hidden="true" />
          <h2 className="font-display text-3xl font-semibold">Notes shoppers search for</h2>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {TRENDING_NOTES.map((note) => (
            <li key={note} className="rounded-full bg-amber-50 px-4 py-2 text-sm capitalize text-amber-900">
              {note}
            </li>
          ))}
        </ul>
        <h3 className="mt-8 font-display text-2xl font-semibold">
          How people describe what they want
        </h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {INTENT_KEYWORDS.map((intent) => (
            <li key={intent} className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700">
              {intent}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-[2rem] bg-stone-950 p-7 text-white">
        <h2 className="font-display text-3xl">Ready to choose your scent?</h2>
        <p className="mt-3 text-stone-300">
          Tell us the notes you like and we will match them to perfumes in stock at our Owerri store.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/perfume-finder" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-stone-950">
            Use the perfume finder
          </Link>
          <Link to="/shop" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white">
            Shop the collection
          </Link>
          <Link to="/blog" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white">
            Read the fragrance journal
          </Link>
        </div>
      </section>
    </main>
  );
}