import { useState } from 'react';
import { X, Heart, ShoppingBag, MessageCircle } from 'lucide-react';
import { formatNaira, whatsappNumber } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function QuickView({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wished = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;
  const price = product.salePrice || product.price;
  const message = encodeURIComponent(`Hello Roc Realm Perfume, I want to order ${product.name}. Quantity: ${qty}. Price: ${formatNaira(price * qty)}.`);
  const altText = `${product.name} ${product.category?.name || 'perfume'} - Original designer fragrance Owerri Imo State`;

  const handleAddToCart = () => {
    if (!outOfStock) {
      addToCart(product, qty);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-stone-100 p-2 hover:bg-stone-200"
          aria-label="Close quick view"
        >
          <X size={20} />
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-stone-100 p-4">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80'}
              alt={altText}
              className="h-80 w-full object-contain"
            />
          </div>

          <div className="py-4">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">{product.category?.name || 'Perfume'}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">{product.name}</h2>
            
            <div className="mt-4 flex items-center gap-3">
              {product.salePrice && <span className="text-lg text-stone-400 line-through">{formatNaira(product.price)}</span>}
              <strong className="text-2xl text-stone-950">{formatNaira(price)}</strong>
            </div>

            {product.description && <p className="mt-4 text-sm leading-6 text-stone-600">{product.description}</p>}

            <div className="mt-4 flex flex-wrap gap-2">
              {product.notes?.map((note) => (
                <span key={note} className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-900">{note}</span>
              ))}
            </div>

            <p className="mt-3 text-sm text-stone-500">Size: {product.size || 'Available on request'}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <input
                type="number"
                min="1"
                max={product.stock || 99}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(product.stock || 99, Number(e.target.value))))}
                className="w-20 rounded-full border border-amber-900/20 px-4 py-2"
              />
              <button
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold ${wished ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-900'}`}
              >
                <Heart size={18} fill={wished ? 'currentColor' : 'none'} /> Wishlist
              </button>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>

            {outOfStock && <p className="mt-4 text-sm font-semibold text-red-600">Out of Stock</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
