import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { api, formatNaira } from '../lib/api.js';

export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
        setSuggestions(res.data.products?.slice(0, 8) || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (product) => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    navigate(`/product/${product.slug}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search perfumes..."
          className="w-full rounded-full bg-stone-100 px-11 py-3 outline-none transition focus:bg-white focus:ring-2 focus:ring-amber-700"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {isOpen && (query.length >= 2 || suggestions.length > 0) && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white shadow-xl border border-amber-900/10">
          {loading ? (
            <div className="p-4 text-center text-stone-500">Searching...</div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="flex w-full items-center gap-4 p-3 hover:bg-amber-50 transition border-b border-stone-100 last:border-0"
                >
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=100&q=80'}
                    alt={product.name}
                    className="h-12 w-12 rounded-xl bg-amber-50 object-contain p-1"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-stone-900">{product.name}</p>
                    <p className="text-sm text-stone-500">{product.category?.name || 'Perfume'}</p>
                  </div>
                  <span className="font-semibold text-amber-700">{formatNaira(product.salePrice || product.price)}</span>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-stone-500">No products found</div>
          ) : (
            <div className="p-4 text-center text-stone-500">Type to search...</div>
          )}
        </div>
      )}
    </div>
  );
}
