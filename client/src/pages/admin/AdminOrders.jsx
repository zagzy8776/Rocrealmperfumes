import { useEffect, useState } from 'react';
import { api, formatNaira } from '../../lib/api.js';

const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get('/orders').then((res) => setOrders(res.data.orders));
  useEffect(() => { load().catch(console.error); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <section className="p-6 lg:p-10">
      <h1 className="font-display text-4xl font-semibold">Orders</h1>
      <div className="mt-8 grid gap-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl">{order.orderNumber}</h2>
                <p className="text-sm text-stone-500">{order.customerName} · {order.customerPhone}</p>
                <p className="mt-1 text-sm text-stone-500">{order.deliveryAddress}, {order.deliveryCity}</p>
              </div>
              <div className="text-right">
                <strong className="text-xl">{formatNaira(order.total)}</strong>
                <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="mt-2 block rounded-full bg-stone-100 px-4 py-2 text-sm">
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-5 grid gap-2 rounded-2xl bg-stone-50 p-4">
              {order.items.map((item) => <div key={item.id} className="flex justify-between text-sm"><span>{item.productName} x {item.quantity}</span><span>{formatNaira(item.total)}</span></div>)}
            </div>
            <p className="mt-3 text-sm text-stone-500">Payment: {order.paymentMethod} · Discount: {formatNaira(order.discount)}</p>
          </article>
        ))}
        {!orders.length && <p className="rounded-[2rem] bg-white p-10 text-center text-stone-500">No orders yet.</p>}
      </div>
    </section>
  );
}
