import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { formatNaira } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="group overflow-hidden rounded-[1.2rem] border border-amber-900/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:rounded-[1.5rem]">
      <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden bg-amber-50">
        <img src={image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
      </Link>
      <div className="p-3 sm:p-4">
        <p className="truncate text-[10px] uppercase tracking-[0.18em] text-amber-700 sm:text-xs">{product.category?.name || 'Perfume'}</p>
        <Link to={`/product/${product.slug}`} className="mt-1 line-clamp-2 font-display text-sm font-semibold leading-tight text-stone-950 sm:text-lg">{product.name}</Link>
        <p className="mt-2 hidden line-clamp-2 text-xs text-stone-600 sm:block">{product.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            {product.salePrice && <span className="block truncate text-[11px] text-stone-400 line-through sm:text-xs">{formatNaira(product.price)}</span>}
            <strong className="block truncate text-xs text-stone-950 sm:text-base">{formatNaira(product.salePrice || product.price)}</strong>
          </div>
          <button onClick={() => addToCart(product)} className="shrink-0 rounded-full bg-stone-950 p-2 text-amber-200 transition hover:bg-amber-700 hover:text-white sm:p-3" aria-label="Add to cart">
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
