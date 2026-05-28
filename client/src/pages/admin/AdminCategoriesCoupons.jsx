import { useEffect, useState } from 'react';
import { api, formatNaira } from '../../lib/api.js';

export default function AdminCategoriesCoupons() {
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [category, setCategory] = useState({ name: '', description: '' });
  const [coupon, setCoupon] = useState({ code: '', type: 'PERCENTAGE', value: '', isActive: true, expiresAt: '' });

  const load = async () => {
    const [catRes, couponRes] = await Promise.all([api.get('/categories'), api.get('/coupons')]);
    setCategories(catRes.data.categories);
    setCoupons(couponRes.data.coupons);
  };
  useEffect(() => { load().catch(console.error); }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    await api.post('/categories', category);
    setCategory({ name: '', description: '' });
    load();
  };

  const addCoupon = async (e) => {
    e.preventDefault();
    await api.post('/coupons', { ...coupon, value: Number(coupon.value), expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString() : null });
    setCoupon({ code: '', type: 'PERCENTAGE', value: '', isActive: true, expiresAt: '' });
    load();
  };

  const deleteCategory = async (id) => { if (confirm('Delete category?')) { await api.delete(`/categories/${id}`); load(); } };
  const deleteCoupon = async (id) => { if (confirm('Delete coupon?')) { await api.delete(`/coupons/${id}`); load(); } };

  return (
    <section className="grid gap-8 p-6 lg:grid-cols-2 lg:p-10">
      <div>
        <h1 className="font-display text-4xl font-semibold">Categories</h1>
        <form onSubmit={addCategory} className="mt-6 grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm">
          <input required placeholder="Category name" value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3" />
          <textarea placeholder="Description" value={category.description} onChange={(e) => setCategory({ ...category, description: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3" />
          <button className="rounded-full bg-stone-950 px-6 py-3 font-semibold text-white">Add Category</button>
        </form>
        <div className="mt-5 grid gap-3">
          {categories.map((cat) => <div key={cat.id} className="flex justify-between rounded-2xl bg-white p-4 shadow-sm"><span>{cat.name}</span><button onClick={() => deleteCategory(cat.id)} className="text-sm text-red-600">Delete</button></div>)}
        </div>
      </div>
      <div>
        <h1 className="font-display text-4xl font-semibold">Coupons</h1>
        <form onSubmit={addCoupon} className="mt-6 grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm">
          <input required placeholder="Code e.g. ROC10" value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })} className="rounded-2xl bg-stone-100 px-4 py-3" />
          <select value={coupon.type} onChange={(e) => setCoupon({ ...coupon, type: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3"><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed Amount</option></select>
          <input required type="number" placeholder="Value" value={coupon.value} onChange={(e) => setCoupon({ ...coupon, value: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3" />
          <input type="date" value={coupon.expiresAt} onChange={(e) => setCoupon({ ...coupon, expiresAt: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={coupon.isActive} onChange={(e) => setCoupon({ ...coupon, isActive: e.target.checked })} /> Active</label>
          <button className="rounded-full bg-stone-950 px-6 py-3 font-semibold text-white">Add Coupon</button>
        </form>
        <div className="mt-5 grid gap-3">
          {coupons.map((item) => <div key={item.id} className="flex justify-between rounded-2xl bg-white p-4 shadow-sm"><span>{item.code} · {item.type === 'PERCENTAGE' ? `${item.value}%` : formatNaira(item.value)}</span><button onClick={() => deleteCoupon(item.id)} className="text-sm text-red-600">Delete</button></div>)}
        </div>
      </div>
    </section>
  );
}
