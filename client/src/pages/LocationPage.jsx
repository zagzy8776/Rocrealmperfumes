import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, MessageCircle, Truck } from 'lucide-react';
import { api, businessInfo, whatsappNumber } from '../lib/api.js';
import { getServiceArea, SERVICE_AREA_LINKS } from '../lib/locations.js';
import { FAQ_ITEMS } from '../lib/faq.js';
import { setPageMeta, setFAQStructuredData } from '../lib/seo.js';
import { LOCATION_KEYWORD_LINE } from '../lib/keywords.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function LocationPage() {
  const { slug } = useParams();
  const area = getServiceArea(slug);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!area) return;
    setPageMeta({
      title: area.title,
      description: area.description,
      keywords: area.keywords.join(', '),
    });
    setFAQStructuredData(FAQ_ITEMS.slice(0, 8));
    api
      .get('/products?limit=6')
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]));
  }, [area]);

  if (!area) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold">Location not found</h1>
        <p className="mt-4 text-stone-600">
          We deliver across {LOCATION_KEYWORD_LINE}. See all delivery areas in the shop.
        </p>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-stone-950 px-6 py-3 font-semibold text-white">
          Back to shop
        </Link>
      </main>
    );
  }

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Delivery locations', path: '/delivery' },
    { name: `${area.city}, ${area.state}`, path: `/locations/${area.slug}` },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={crumbs} />
      <section className="luxury-gradient mt-6 rounded-[2.5rem] p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Delivery Area</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">{area.h1}</h1>
        <p className="mt-4 max-w-3xl text-stone-300">{area.intro[1]}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/shop" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-stone-950">
            Shop original perfumes
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white"
          >
            <MessageCircle size={18} aria-hidden="true" /> Order on WhatsApp
          </a>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[2.5rem] bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-display text-3xl font-semibold">
            Perfume delivery in {area.city}
          </h2>
          <p className="mt-4 leading-8 text-stone-700">{area.intro[0]}</p>
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-5">
            <Truck className="mt-0.5 shrink-0 text-amber-700" aria-hidden="true" />
            <p className="text-sm leading-7 text-stone-700">{area.delivery}</p>
          </div>
          <h3 className="mt-8 font-display text-2xl font-semibold">Areas we cover</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {area.landmarks.map((place) => (
              <li key={place} className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700">
                {place}
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-[2.5rem] bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-semibold">Visit our Owerri store</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">{businessInfo.fullAddress}</p>
          <p className="mt-2 text-sm text-stone-600">{businessInfo.openingHours}</p>
          <iframe
            title="Google Map showing Roc Realm Perfumes, a perfume store in Owerri, Imo State"
            src={businessInfo.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-5 h-64 w-full rounded-2xl border border-amber-900/10"
          />
          <a
            href={businessInfo.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-800"
          >
            <MapPin size={16} aria-hidden="true" /> Get directions on Google Maps
          </a>
          <a href={`tel:${businessInfo.callLine}`} className="mt-3 block text-sm font-semibold text-stone-800">
            Store line: {businessInfo.callLine}
          </a>
        </aside>
      </section>

      {products.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-4xl font-semibold">
            Trending perfumes for {area.city}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 rounded-[2.5rem] bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-display text-3xl font-semibold">Other delivery areas</h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {SERVICE_AREA_LINKS.filter((link) => link.slug !== area.slug).map((link) => (
            <li key={link.slug}>
              <Link
                to={link.path}
                className="inline-block rounded-full bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                Perfume delivery in {link.city}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-stone-600">
          Looking for something specific? Read our{' '}
          <Link to="/faq" className="font-semibold text-amber-800">
            perfume FAQ
          </Link>{' '}
          or explore the{' '}
          <Link to="/fragrance-glossary" className="font-semibold text-amber-800">
            fragrance glossary
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
