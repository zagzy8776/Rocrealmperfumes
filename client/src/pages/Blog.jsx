import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../lib/blogPosts.js';
import { setPageMeta } from '../lib/seo.js';
import { LOCATION_KEYWORD_LINE } from '../lib/keywords.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

export default function Blog() {
  useEffect(() => {
    setPageMeta({
      title: 'Perfume Guides and Tips for Nigeria',
      description: `Perfume guides for Nigerian shoppers: spotting fake perfume, oil perfume longevity, scents for Nigerian heat, gifting and choosing a signature scent. Delivery across ${LOCATION_KEYWORD_LINE}.`,
      keywords: ['perfume guide Nigeria', 'how to choose perfume', 'perfume blog Owerri', 'fake perfume Nigeria', 'long lasting perfume tips'],
    });
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Fragrance Journal', path: '/blog' }]} />
      <section className="luxury-gradient mt-6 rounded-[2.5rem] p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Perfume Advice</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Roc Realm Fragrance Journal</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Guides for choosing perfumes, oils, gifts and long-lasting scents for Owerri, Imo State and Nigerian weather.</p>
      </section>
      <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article key={post.slug} className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Guide</p>
            <h2 className="mt-3 font-display text-2xl font-semibold">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} className="mt-5 inline-block font-semibold text-amber-800">Read article</Link>
          </article>
        ))}
      </section>
      <section className="mt-12 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-display text-3xl font-semibold">Shop and learn more</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/shop" className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">Shop perfumes</Link>
          <Link to="/perfume-finder" className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">Perfume finder</Link>
          <Link to="/faq" className="rounded-full bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900">Perfume FAQ</Link>
          <Link to="/fragrance-glossary" className="rounded-full bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900">Fragrance glossary</Link>
          <Link to="/locations/owerri" className="rounded-full bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900">Perfume shop in Owerri</Link>
        </div>
      </section>
    </main>
  );
}