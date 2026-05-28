import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { formatNaira } from '../lib/api.js';

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <CheckCircle2 className="mx-auto text-green-600" size={70} />
      <h1 className="mt-6 font-display text-5xl font-semibold">Order Sent</h1>
      <p className="mt-4 text-stone-600">Your order has been saved and a WhatsApp message has been prepared for Roc Realm Perfume.</p>
      {order && <p className="mt-4 rounded-2xl bg-white p-4 shadow-sm">Order <strong>{order.orderNumber}</strong> · Total <strong>{formatNaira(order.total)}</strong></p>}
      <Link to="/shop" className="mt-8 inline-block rounded-full bg-stone-950 px-7 py-4 font-semibold text-white">Continue Shopping</Link>
    </main>
  );
}
