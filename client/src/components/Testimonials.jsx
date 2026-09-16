import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { api } from '../lib/api.js';
import { setOrganizationStructuredData } from '../lib/seo.js';

export default function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    api
      .get('/testimonials')
      .then((res) => {
        if (!active) return;
        const list = (res.data.testimonials || []).filter((item) => item.quote);
        setItems(list);
        if (list.length) setOrganizationStructuredData(list);
      })
      .catch(() => setItems([]));
    return () => {
      active = false;
    };
  }, []);

  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Reviews</p>
      <h2 className="mt-3 font-display text-4xl font-semibold">
        What perfume lovers in Owerri and Nigeria say
      </h2>
      <p className="mt-3 max-w-2xl text-stone-600">
        Real feedback from customers who ordered original designer and Arabian fragrances from Roc
        Realm Perfumes in Owerri, Imo State.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((item) => (
          <figure key={item.id} className="rounded-[2rem] bg-white p-6 shadow-sm">
            <Quote className="text-amber-500" size={22} aria-hidden="true" />
            <blockquote className="mt-4 text-sm leading-7 text-stone-700">“{item.quote}”</blockquote>
            <figcaption className="mt-5 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-stone-900">
                {item.name}
                {item.location ? (
                  <span className="block text-xs font-normal text-stone-500">{item.location}</span>
                ) : null}
              </span>
              <span
                className="flex items-center gap-0.5"
                role="img"
                aria-label={`${item.rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill={star <= item.rating ? 'currentColor' : 'none'}
                    className={star <= item.rating ? 'text-amber-500' : 'text-stone-300'}
                    aria-hidden="true"
                  />
                ))}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
