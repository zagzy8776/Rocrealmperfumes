import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { api, formatNaira, whatsappNumber } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${slug}`).then((res) => setProduct(res.data.product)).catch(() => setProduct(null));
  }, [slug]);

  if (!product) return <main className="mx-auto max-w-7xl px-4 py-20 text-center">Loading product...</main>;

  const price = product.salePrice || product.price;
  const message = encodeURIComponent(`Hello Roc Realm Perfume, I want to order ${product.name}. Quantity: ${qty}. Price: ${formatNaira(price * qty)}.`);

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="overflow-hidden rounded-[3rem] bg-white shadow-sm">
        <img src={product.images?.[0]} alt={product.name} className="h-[36rem] w-full object-cover" />
      </div>
      <div className="py-6">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">{product.category?.name}</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">{product.name}</h1>
        <div className="mt-5 flex items-center gap-3">
          {product.salePrice && <span className="text-xl text-stone-400 line-through">{formatNaira(product.price)}</span>}
          <strong className="text-3xl text-stone-950">{formatNaira(price)}</strong>
        </div>
        <p className="mt-6 leading-8 text-stone-600">{product.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {product.notes?.map((note) => <span key={note} className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-900">{note}</span>)}
        </div>
        <p className="mt-5 text-sm text-stone-500">Size: {product.size || 'Available on request'} · Stock: {product.stock > 0 ? 'In stock' : 'Out of stock'}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <input type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="w-24 rounded-full border border-amber-900/20 px-4 py-3" />
          <button onClick={() => addToCart(product, qty)} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-7 py-4 font-semibold text-white hover:bg-amber-700"><ShoppingBag size={18} /> Add to Cart</button>
          <a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-4 font-semibold text-white hover:bg-green-700"><MessageCircle size={18} /> WhatsApp</a>
        </div>
        <Link to="/shop" className="mt-8 inline-block font-semibold text-amber-800">Back to shop</Link>
      </div>
    </main>
  );
}
