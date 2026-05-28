import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { api } from '../lib/api.js';

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    api.get('/gallery').then((res) => setImages(res.data.images)).catch(() => setImages([]));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] bg-stone-950 p-8 text-white md:p-12">
        <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-amber-300"><Camera size={18} /> Gallery</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Roc Realm Moments</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Explore product drops, store moments, new arrivals, gifts, and luxury lifestyle updates from Roc Realm Perfumes.</p>
      </div>

      <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {images.map((image) => (
          <article key={image.id} className="mb-5 break-inside-avoid overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <img src={image.imageUrl} alt={image.title || 'Roc Realm gallery'} className="w-full object-cover" />
            {(image.title || image.caption) && <div className="p-5"><h2 className="font-display text-xl font-semibold">{image.title}</h2><p className="mt-2 text-sm text-stone-600">{image.caption}</p></div>}
          </article>
        ))}
      </div>
      {!images.length && <p className="py-20 text-center text-stone-500">No gallery images yet.</p>}
    </main>
  );
}
