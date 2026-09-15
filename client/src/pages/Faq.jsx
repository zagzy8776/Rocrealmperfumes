import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { FAQ_GROUPS, FAQ_ITEMS } from '../lib/faq.js';
import { setPageMeta, setFAQStructuredData } from '../lib/seo.js';
import { LOCATION_KEYWORD_LINE, TRENDING_KEYWORD_LINE } from '../lib/keywords.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ReviewCTA from '../components/ReviewCTA.jsx';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Perfume FAQ', path: '/faq' },
];

export default function Faq() {
  useEffect(() => {
    setPageMeta({
      title: 'Perfume FAQ | Delivery, Original Scents, Owerri',
      description: 'Perfume FAQ: delivery and payment, spotting fake perfume, longevity, trending notes and gifting. Roc Realm Perfumes, Uratta, Owerri, Imo State.',
      keywords: [
        'perfume FAQ Owerri',
        'is my perfume original',
        'perfume delivery Owerri',
        'long lasting perfume Nigeria',
        'perfume questions Nigeria',
      ].join(', '),
    });
    setFAQStructuredData(FAQ_ITEMS);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={crumbs} />
      <section className="luxury-gradient mt-6 rounded-[2.5rem] p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Help Centre</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">
          Perfume questions, answered
        </h1>
        <p className="mt-4 max-w-2xl text-stone-300">
          Everything customers ask us about ordering, delivery across Owerri, Port Harcourt,
          Onitsha, Anambra and Enugu, original fragrances, longevity and gifting.
        </p>
      </section>

      {FAQ_GROUPS.map((group) => (
        <section key={group.title} className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <HelpCircle className="text-amber-700" aria-hidden="true" />
            <h2 className="font-display text-3xl font-semibold">{group.title}</h2>
          </div>
          <div className="mt-6 grid gap-4">
            {group.items.map((item) => (
              <article key={item.question} className="rounded-2xl bg-amber-50 p-5">
                <h3 className="font-semibold text-stone-950">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-stone-700">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-10 rounded-[2rem] bg-stone-950 p-7 text-white">
        <h2 className="font-display text-3xl">Still have a question?</h2>
        <p className="mt-3 text-stone-300">
          Call the store line on 08085100229 or send a WhatsApp message and we will recommend a
          fragrance for your budget and occasion.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/contact" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-stone-950">
            Contact us
          </Link>
          <Link to="/shop" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white">
            Shop original perfumes
          </Link>
          <Link to="/perfume-finder" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white">
            Try the perfume finder
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <ReviewCTA compact />
      </div>
    </main>
  );
}
