import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../lib/api.js';
import { setPageMeta, setCategoryBreadcrumbSchema } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';

const PRODUCTS_PER_BATCH = 12;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');
  const [availability, setAvailability] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, hasMore: false });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);


  useEffect(() => {
    setPageMeta({ 
      title: 'Shop Perfumes in Owerri | Original Fragrances Imo State',
      description: 'Shop original designer, Arabian and oil perfumes, oud and gift sets at Roc Realm Perfumes, Owerri. Owerri delivery plus nationwide dispatch.'
    });
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find(cat => cat.slug === category);
      if (selectedCategory) {
        setCategoryBreadcrumbSchema(selectedCategory.name, selectedCategory.slug);
      }
    } else {
      setCategoryBreadcrumbSchema('Shop', '');
    }
  }, [category, categories]);

  const fetchProducts = async (targetPage = 1) => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      selectedCategories.forEach(cat => params.append('category', cat));
    } else if (category) {
      params.set('category', category);
    }
    if (search) params.set('search', search);
    if (availability !== 'all') params.set('availability', availability);
    if (sort !== 'new') params.set('sort', sort);
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    params.set('page', String(targetPage));
    params.set('limit', String(PRODUCTS_PER_BATCH));

    setLoading(true);
    try {
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination || { total: res.data.products.length, totalPages: 1, hasMore: false });
      setPage(targetPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setProducts([]);
      setPagination({ total: 0, totalPages: 1, hasMore: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(1); }, [category, search, sort, availability, selectedCategories, priceRange]);

  const toggleCategory = (slug) => {
    setSelectedCategories(prev => {
      if (prev.includes(slug)) {
        return prev.filter(c => c !== slug);
      } else {
        return [...prev, slug];
      }
    });
  };

  const clearFilters = () => {
    setCategory('');
    setSelectedCategories([]);
    setSearch('');
    setSort('new');
    setAvailability('all');
    setPriceRange({ min: '', max: '' });
  };

  const hasActiveFilters = selectedCategories.length > 0 || search || availability !== 'all' || priceRange.min || priceRange.max;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] bg-stone-950 p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Shop</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Luxury Collection</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Browse original designer Arabian fragrances, oil perfumes, body mists, sprays, diffusers, humidifiers, and gift-ready selections.</p>
      </div>

      <div className="mt-8 rounded-[2rem] border border-amber-900/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-3 font-semibold text-stone-800 hover:bg-stone-200">
            <SlidersHorizontal size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100">
              <X size={16} />
              Clear All
            </button>
          )}
          <label className="flex items-center gap-3 rounded-full bg-stone-100 px-4 flex-1 max-w-md">
            <Search size={18} className="text-stone-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search perfumes, body mists, diffusers..." className="w-full bg-transparent py-3 outline-none" />
          </label>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 border-t border-amber-900/10 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">Categories</label>
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-2xl bg-stone-50 p-3">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.slug)}
                      onChange={() => toggleCategory(cat.slug)}
                      className="rounded border-amber-900/20 text-amber-700 focus:ring-amber-700"
                    />
                    <span className="text-sm text-stone-700">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">Price Range (₦)</label>
              <div className="grid gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full rounded-2xl bg-stone-100 px-4 py-3 outline-none">
                <option value="new">Newest First</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">Availability</label>
              <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="w-full rounded-2xl bg-stone-100 px-4 py-3 outline-none">
                <option value="all">All Products</option>
                <option value="available">In Stock Only</option>
                <option value="outofstock">Out of Stock</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 rounded-[2rem] bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
      </div>


      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {loading && <p className="py-8 text-center text-stone-500">Loading products...</p>}
      {pagination.totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button disabled={loading || page <= 1} onClick={() => fetchProducts(page - 1)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-amber-900/10 disabled:cursor-not-allowed disabled:opacity-40">
            Previous
          </button>
          {pageNumbers.map((pageNumber) => (
            <button key={pageNumber} disabled={loading} onClick={() => fetchProducts(pageNumber)} className={`h-11 w-11 rounded-full text-sm font-bold shadow-sm ${pageNumber === page ? 'bg-stone-950 text-white' : 'bg-white text-stone-800 ring-1 ring-amber-900/10'}`}>
              {pageNumber}
            </button>
          ))}
          <button disabled={loading || page >= pagination.totalPages} onClick={() => fetchProducts(page + 1)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-amber-900/10 disabled:cursor-not-allowed disabled:opacity-40">
            Next
          </button>
          <p className="w-full text-center text-sm text-stone-500">Page {page} of {pagination.totalPages} · {pagination.total} products</p>
        </div>
      )}
      {!products.length && !loading && <p className="py-20 text-center text-stone-500">No products found.</p>}
    </main>
  );
}
