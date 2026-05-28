import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, formatNaira, whatsappNumber } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', deliveryAddress: '', deliveryCity: 'Owerri', deliveryNote: '', paymentMethod: 'BANK_TRANSFER' });

  const total = Math.max(0, subtotal - discount);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const validateCoupon = async () => {
    if (!couponCode) return;
    const res = await api.post('/coupons/validate', { code: couponCode, subtotal });
    setDiscount(res.data.discount);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        ...form,
        couponCode: couponCode || null,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      });
      const order = res.data.order;
      const lines = order.items.map((item, index) => `${index + 1}. ${item.productName} - ${formatNaira(item.productPrice)} x ${item.quantity}`).join('\n');
      const message = encodeURIComponent(`Hello Roc Realm Perfume, I just placed an order.\n\nOrder No: ${order.orderNumber}\nName: ${order.customerName}\nPhone: ${order.customerPhone}\nAddress: ${order.deliveryAddress}, ${order.deliveryCity || ''}\n\nItems:\n${lines}\n\nSubtotal: ${formatNaira(order.subtotal)}\nDiscount: ${formatNaira(order.discount)}\nTotal: ${formatNaira(order.total)}\nPayment: ${order.paymentMethod}\n\nPlease confirm availability.`);
      clearCart();
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
      navigate('/order-success', { state: { order } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-semibold">Checkout</h1>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input required placeholder="Full name" value={form.customerName} onChange={(e) => update('customerName', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <input required placeholder="Phone number" value={form.customerPhone} onChange={(e) => update('customerPhone', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <input placeholder="Email optional" value={form.customerEmail} onChange={(e) => update('customerEmail', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <input placeholder="City/State" value={form.deliveryCity} onChange={(e) => update('deliveryCity', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <textarea required placeholder="Delivery address" value={form.deliveryAddress} onChange={(e) => update('deliveryAddress', e.target.value)} className="min-h-28 rounded-2xl bg-stone-100 px-4 py-3 outline-none md:col-span-2" />
            <textarea placeholder="Delivery note optional" value={form.deliveryNote} onChange={(e) => update('deliveryNote', e.target.value)} className="min-h-24 rounded-2xl bg-stone-100 px-4 py-3 outline-none md:col-span-2" />
            <select value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none md:col-span-2">
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="PAY_ON_DELIVERY">Pay on Delivery</option>
              <option value="WHATSAPP_CONFIRMATION">Confirm on WhatsApp</option>
            </select>
          </div>
        </div>
        <aside className="h-fit rounded-[2rem] bg-stone-950 p-6 text-white">
          <h2 className="font-display text-2xl">Summary</h2>
          <div className="mt-5 grid gap-3 text-sm text-stone-300">
            {items.map((item) => <div key={item.id} className="flex justify-between gap-3"><span>{item.name} x {item.quantity}</span><span>{formatNaira(item.price * item.quantity)}</span></div>)}
          </div>
          <div className="mt-6 flex gap-2">
            <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon" className="w-full rounded-full bg-white/10 px-4 py-3 outline-none" />
            <button type="button" onClick={validateCoupon} className="rounded-full bg-white/10 px-4 py-3">Apply</button>
          </div>
          <div className="mt-6 grid gap-3 border-t border-white/10 pt-5">
            <div className="flex justify-between"><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div>
            <div className="flex justify-between"><span>Discount</span><strong>{formatNaira(discount)}</strong></div>
            <div className="flex justify-between text-xl"><span>Total</span><strong>{formatNaira(total)}</strong></div>
          </div>
          <button disabled={loading || !items.length} className="mt-6 w-full rounded-full bg-amber-500 px-6 py-4 font-semibold text-stone-950 disabled:opacity-50">{loading ? 'Placing order...' : 'Place Order via WhatsApp'}</button>
        </aside>
      </form>
    </main>
  );
}
