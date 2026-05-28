import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { formatNaira } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-amber-900/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-amber-50">
        <img src={image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
      </Link>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-700">{product.category?.name || 'Perfume'}</p>
        <Link to={`/product/${product.slug}`} className="mt-2 block font-display text-xl font-semibold text-stone-950">{product.name}</Link>
        <p className="mt-2 line-clamp-2 text-sm text-stone-600">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            {product.salePrice && <span className="mr-2 text-sm text-stone-400 line-through">{formatNaira(product.price)}</span>}
            <strong className="text-lg text-stone-950">{formatNaira(product.salePrice || product.price)}</strong>
          </div>
          <button onClick={() => addToCart(product)} className="rounded-full bg-stone-950 p-3 text-amber-200 transition hover:bg-amber-700 hover:text-white" aria-label="Add to cart">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
