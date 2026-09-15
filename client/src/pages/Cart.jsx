import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { api, formatNaira } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';
import { setPageMeta } from '../lib/seo.js';

export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    setPageMeta({ 
      title: 'Your Perfume Cart | Roc Realm Owerri Imo State', 
      description: 'View your cart items and proceed to checkout at Roc Realm Perfumes - #1 perfume store in Owerri, Imo State. Original designer Arabian fragrances.',
      noindex: true
    });
  }, []);

  const validateCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponMessage('');
    try {
      const res = await api.post('/coupons/validate', { code: couponCode.toUpperCase(), subtotal });
      setDiscount(res.data.discount);
      setCouponMessage(`Coupon applied: ${formatNaira(res.data.discount)} off.`);
    } catch (err) {
      setDiscount(0);
      setCouponMessage(err.response?.data?.message || 'Coupon is invalid or expired.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const total = Math.max(0, subtotal - discount);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-semibold">Your Cart</h1>
      {!items.length ? (
        <div className="mt-10 rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <p className="text-stone-600">Your cart is empty.</p>
          <Link to="/shop" className="mt-5 inline-block rounded-full bg-stone-950 px-7 py-3 font-semibold text-white">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-[2rem] bg-white p-4 shadow-sm">
                <img src={item.image} alt={item.name} className="h-28 w-24 rounded-2xl bg-amber-50 object-contain p-1" />
                <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold">{item.name}</h2>
                    <p className="text-stone-600">{formatNaira(item.price)}</p>
                  </div>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} className="w-20 rounded-full border px-4 py-2" />
                  <strong>{formatNaira(item.price * item.quantity)}</strong>
                  <button onClick={() => removeFromCart(item.id)} className="rounded-full bg-red-50 p-3 text-red-600"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-[2rem] bg-stone-950 p-6 text-white">
            <h2 className="font-display text-2xl">Order Summary</h2>
            <div className="mt-6 flex justify-between border-b border-white/10 pb-4"><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div>
            {discount > 0 && <div className="mt-2 flex justify-between text-green-400"><span>Discount</span><strong>-{formatNaira(discount)}</strong></div>}
            <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-xl"><span>Total</span><strong>{formatNaira(total)}</strong></div>
            
            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold"><Tag size={16} /> Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm outline-none placeholder:text-stone-400"
                />
                <button
                  onClick={validateCoupon}
                  disabled={validatingCoupon || !couponCode}
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {validatingCoupon ? '...' : 'Apply'}
                </button>
              </div>
              {couponMessage && (
                <div className={`mt-2 flex items-center gap-2 text-xs ${discount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {discount > 0 ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {couponMessage}
                </div>
              )}
            </div>
            
            <Link to="/checkout" state={{ discount }} className="mt-6 block rounded-full bg-amber-500 px-6 py-4 text-center font-semibold text-stone-950">Proceed to Checkout</Link>
            <Link to="/shop" className="mt-3 block rounded-full border border-white/15 px-6 py-4 text-center font-semibold">Continue Shopping</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
