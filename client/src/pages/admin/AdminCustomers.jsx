import { useEffect, useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { api, formatNaira } from '../../lib/api.js';

const phoneToWhatsapp = (phone) => phone?.replace(/\D/g, '').replace(/^0/, '234');

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState({});
  const [loadingOrders, setLoadingOrders] = useState({});
  
  useEffect(() => { api.get('/orders/customers/summary').then((res) => setCustomers(res.data.customers)).catch(() => setCustomers([])); }, []);
  
  const toggleCustomerOrders = async (phone) => {
    if (expandedCustomer === phone) {
      setExpandedCustomer(null);
      return;
    }
    
    setExpandedCustomer(phone);
    setLoadingOrders((prev) => ({ ...prev, [phone]: true }));
    
    try {
      const res = await api.get(`/orders/by-phone/${phone}`);
      setCustomerOrders((prev) => ({ ...prev, [phone]: res.data.orders || [] }));
    } catch {
      setCustomerOrders((prev) => ({ ...prev, [phone]: [] }));
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [phone]: false }));
    }
  };
  return <section className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.28em] text-amber-700">Customer CRM</p><h1 className="mt-2 font-display text-4xl font-semibold">Customers</h1><p className="mt-2 text-stone-600">See repeat buyers, total spend, favorite products, order history, and message them on WhatsApp.</p>
    <div className="mt-8 grid gap-4">{customers.map((customer) => { const msg = encodeURIComponent(`Hello ${customer.name}, Roc Realm Perfumes has new arrivals and special recommendations for you.`); const orders = customerOrders[customer.phone] || []; const isExpanded = expandedCustomer === customer.phone; return <article key={customer.phone} className="rounded-[2rem] bg-white p-5 shadow-sm"><div className="grid gap-4 md:grid-cols-[1fr_160px_180px_160px_auto] md:items-center"><div><div className="flex items-center gap-2"><strong>{customer.name}</strong>{customer.totalOrders > 1 && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Repeat</span>}</div><p className="text-sm text-stone-500">{customer.phone} · {customer.email || 'No email'}</p><p className="text-sm text-stone-500">Favorite: {customer.favoriteProduct}</p></div><span>{customer.totalOrders} orders</span><strong>{formatNaira(customer.totalSpent)}</strong><a href={`https://wa.me/${phoneToWhatsapp(customer.phone)}?text=${msg}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800"><MessageCircle size={15} /> Promo</a><button onClick={() => toggleCustomerOrders(customer.phone)} className="p-2 hover:bg-stone-100 rounded-full">{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button></div>{isExpanded && <div className="mt-4 border-t border-amber-900/10 pt-4">{loadingOrders[customer.phone] ? <p className="text-sm text-stone-500">Loading orders...</p> : orders.length > 0 ? <div className="space-y-3">{orders.map((order) => <div key={order.id} className="rounded-2xl bg-stone-50 p-3"><div className="flex justify-between"><span className="font-semibold">{order.orderNumber}</span><span className={`rounded-full px-2 py-1 text-xs font-semibold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{order.status}</span></div><p className="mt-1 text-sm text-stone-600">{new Date(order.createdAt).toLocaleDateString()} · {formatNaira(order.total)}</p><p className="text-xs text-stone-500">{order.items?.map((i) => i.productName).join(', ') || 'No items'}</p></div>)}</div> : <p className="text-sm text-stone-500">No order history available.</p>}</div>}</article>; })}{!customers.length && <p className="rounded-[2rem] bg-white p-10 text-center text-stone-500">No customers yet.</p>}</div>
  </section>;
}