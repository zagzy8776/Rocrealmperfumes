import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');
  const [availability, setAvailability] = useState('all');
  const [gender, setGender] = useState('');
  const [scentFamily, setScentFamily] = useState('');
  const [occasion, setOccasion] = useState('');
  const [brandType, setBrandType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    setPageMeta({ title: 'Shop Perfumes', description: 'Browse Roc Realm Perfumes collection: original designer Arabian fragrances, oil perfumes, body mists, diffusers, humidifiers, gift sets, and home scents in Owerri.' });
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (gender) params.set('gender', gender);
    if (scentFamily) params.set('scentFamily', scentFamily);
    if (occasion) params.set('occasion', occasion);
    if (brandType) params.set('brandType', brandType);
    if (priceRange === 'under20') params.set('maxPrice', '20000');
    if (priceRange === '20to50') { params.set('minPrice', '20000'); params.set('maxPrice', '50000'); }
    if (priceRange === 'above50') params.set('minPrice', '50000');
    if (priceRange === 'sale') params.set('sale', 'true');
    api.get(`/products?${params.toString()}`).then((res) => setProducts(res.data.products)).catch(() => setProducts([]));
  }, [category, search, gender, scentFamily, occasion, brandType, priceRange]);

  const sorted = useMemo(() => products.filter((product) => availability === 'all' ? true : product.stock > 0).sort((a, b) => {
    const ap = Number(a.salePrice || a.price);
    const bp = Number(b.salePrice || b.price);
    if (sort === 'low') return ap - bp;
    if (sort === 'high') return bp - ap;
    return 0;
  }), [products, sort, availability]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] bg-stone-950 p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Shop</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Luxury Collection</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Browse original designer Arabian fragrances, oil perfumes, body mists, sprays, diffusers, humidifiers, and gift-ready selections.</p>
      </div>

      <div className="mt-8 grid gap-4 rounded-[2rem] border border-amber-900/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px_180px]">
        <label className="flex items-center gap-3 rounded-full bg-stone-100 px-4">
          <Search size={18} className="text-stone-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search perfumes, body mists, diffusers..." className="w-full bg-transparent py-3 outline-none" />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">
          <option value="">All categories</option>
          {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">
          <option value="new">Newest</option>
          <option value="low">Price: Low</option>
          <option value="high">Price: High</option>
        </select>
        <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">
          <option value="all">All stock</option>
          <option value="available">Available only</option>
        </select>
      </div>

      <div className="mt-4 grid gap-3 rounded-[2rem] bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none"><option value="">Gender</option><option>Female</option><option>Male</option><option>Unisex</option></select>
        <select value={scentFamily} onChange={(e) => setScentFamily(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none"><option value="">Scent family</option><option>Sweet</option><option>Fresh</option><option>Oud</option><option>Floral</option><option>Woody</option><option>Musk</option></select>
        <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none"><option value="">Occasion</option><option>Everyday</option><option>Office</option><option>Date night</option><option>Gift</option><option>Event</option></select>
        <select value={brandType} onChange={(e) => setBrandType(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none"><option value="">Brand/type</option><option>Designer</option><option>Oil Perfume</option><option>Body Mist</option><option>Home Fragrance</option></select>
        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none"><option value="">Price/sale</option><option value="under20">Under ₦20k</option><option value="20to50">₦20k - ₦50k</option><option value="above50">₦50k+</option><option value="sale">On sale</option></select>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {sorted.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {!sorted.length && <p className="py-20 text-center text-stone-500">No products found.</p>}
    </main>
  );
}
