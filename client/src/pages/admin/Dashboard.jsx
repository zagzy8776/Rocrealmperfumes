import { useEffect, useState } from 'react';
import { api, formatNaira } from '../../lib/api.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/orders/stats/summary').then((res) => setStats(res.data)).catch(() => setStats(null));
  }, []);

  const cards = [
    ['Total Sales', formatNaira(stats?.totalSales || 0)],
    ['Total Orders', stats?.totalOrders || 0],
    ['Pending Orders', stats?.pendingOrders || 0],
    ['Products', stats?.totalProducts || 0],
    ['Out of Stock', stats?.outOfStockProducts || 0],
  ];

  return (
    <section className="p-6 lg:p-10">
      <h1 className="font-display text-4xl font-semibold">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">{label}</p>
            <strong className="mt-3 block text-2xl">{value}</strong>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[2rem] bg-stone-950 p-8 text-white">
        <h2 className="font-display text-3xl">Admin Notes</h2>
        <p className="mt-3 text-stone-300">Use Products to update perfumes, Orders to manage customer requests, and Categories & Coupons to organize the store.</p>
      </div>
    </section>
  );
}
