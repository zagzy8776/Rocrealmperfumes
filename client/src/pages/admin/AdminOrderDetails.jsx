import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, Printer } from 'lucide-react';
import { api, formatNaira } from '../../lib/api.js';

const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED'];
const phoneToWhatsapp = (phone) => phone?.replace(/\D/g, '').replace(/^0/, '234');

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const load = () => api.get(`/orders/${id}`).then((res) => setOrder(res.data.order)).catch((err) => setError(err.response?.data?.message || 'Unable to load order.'));
  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status) => { await api.put(`/orders/${id}/status`, { status }); load(); };
  if (error) return <section className="p-6 lg:p-10"><p className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</p></section>;
  if (!order) return <section className="p-6 lg:p-10">Loading order...</section>;

  const whatsapp = phoneToWhatsapp(order.customerPhone);
  const message = encodeURIComponent(`Hello ${order.customerName}, this is Roc Realm Perfumes. We are contacting you about order ${order.orderNumber}.`);

  return (
    <section className="p-6 lg:p-10">
      <Link to="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800"><ArrowLeft size={16} /> Back to orders</Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-sm uppercase tracking-[0.28em] text-amber-700">Order Details</p><h1 className="mt-2 font-display text-4xl font-semibold">{order.orderNumber}</h1><p className="mt-2 text-stone-600">Placed {new Date(order.createdAt).toLocaleString()}</p></div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-white"><Printer size={16} /> Print</button>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="font-display text-2xl">Items</h2><div className="mt-4 grid gap-3">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-4 rounded-2xl bg-stone-50 p-4"><span>{item.productName} x {item.quantity}</span><strong>{formatNaira(item.total)}</strong></div>)}</div></div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="font-display text-2xl">Delivery Note</h2><p className="mt-3 text-stone-600">{order.deliveryNote || 'No delivery note.'}</p></div>
        </div>
        <aside className="grid h-fit gap-4 rounded-[2rem] bg-stone-950 p-6 text-white">
          <h2 className="font-display text-2xl">Customer</h2>
          <p>{order.customerName}</p><p className="text-stone-300">{order.customerPhone}</p>{order.customerEmail && <p className="text-stone-300">{order.customerEmail}</p>}
          <p className="text-stone-300">{order.deliveryAddress}, {order.deliveryCity}</p>
          <div className="border-t border-white/10 pt-4"><div className="flex justify-between"><span>Subtotal</span><strong>{formatNaira(order.subtotal)}</strong></div><div className="mt-2 flex justify-between"><span>Discount</span><strong>{formatNaira(order.discount)}</strong></div><div className="mt-2 flex justify-between text-xl"><span>Total</span><strong>{formatNaira(order.total)}</strong></div></div>
          <select value={order.status} onChange={(e) => updateStatus(e.target.value)} className="rounded-full bg-white/10 px-4 py-3 outline-none">{statuses.map((status) => <option key={status} value={status} className="text-stone-950">{status}</option>)}</select>
          <div className="flex gap-2"><a href={`tel:${order.customerPhone}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><Phone size={15} /> Call</a>{whatsapp && <a href={`https://wa.me/${whatsapp}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2"><MessageCircle size={15} /> WhatsApp</a>}</div>
        </aside>
      </div>
    </section>
  );
}