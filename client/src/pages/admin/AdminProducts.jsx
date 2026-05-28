import { useEffect, useState } from 'react';
import { api, formatNaira } from '../../lib/api.js';

const empty = { name: '', description: '', price: '', salePrice: '', size: '', notes: '', images: '', stock: 0, isFeatured: false, isActive: true, categoryId: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [productRes, categoryRes] = await Promise.all([api.get('/products/admin/all'), api.get('/categories')]);
    setProducts(productRes.data.products);
    setCategories(categoryRes.data.categories);
  };

  useEffect(() => { load().catch(console.error); }, []);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      stock: Number(form.stock),
      categoryId: form.categoryId || null,
      notes: form.notes.split(',').map((item) => item.trim()).filter(Boolean),
      images: form.images.split('\n').map((item) => item.trim()).filter(Boolean),
    };
    if (editing) await api.put(`/products/${editing}`, payload); else await api.post('/products', payload);
    setForm(empty);
    setEditing(null);
    load();
  };

  const edit = (product) => {
    setEditing(product.id);
    setForm({ ...product, salePrice: product.salePrice || '', categoryId: product.categoryId || '', notes: product.notes?.join(', ') || '', images: product.images?.join('\n') || '' });
  };

  const remove = async (id) => {
    if (confirm('Delete this product?')) {
      await api.delete(`/products/${id}`);
      load();
    }
  };

  return (
    <section className="p-6 lg:p-10">
      <h1 className="font-display text-4xl font-semibold">Products</h1>
      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm lg:grid-cols-2">
        <input required placeholder="Product name" value={form.name} onChange={(e) => update('name', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3" />
        <select value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3"><option value="">No category</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select>
        <input required type="number" placeholder="Price" value={form.price} onChange={(e) => update('price', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3" />
        <input type="number" placeholder="Sale price optional" value={form.salePrice} onChange={(e) => update('salePrice', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3" />
        <input placeholder="Size e.g. 100ml" value={form.size || ''} onChange={(e) => update('size', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3" />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3" />
        <textarea required placeholder="Description" value={form.description} onChange={(e) => update('description', e.target.value)} className="min-h-24 rounded-2xl bg-stone-100 px-4 py-3 lg:col-span-2" />
        <input placeholder="Notes comma separated" value={form.notes} onChange={(e) => update('notes', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 lg:col-span-2" />
        <textarea placeholder="Image URLs, one per line" value={form.images} onChange={(e) => update('images', e.target.value)} className="min-h-20 rounded-2xl bg-stone-100 px-4 py-3 lg:col-span-2" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} /> Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} /> Active</label>
        <button className="rounded-full bg-stone-950 px-6 py-4 font-semibold text-white lg:col-span-2">{editing ? 'Update Product' : 'Add Product'}</button>
      </form>

      <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-sm">
        {products.map((product) => <div key={product.id} className="grid gap-3 border-b p-4 md:grid-cols-[1fr_120px_160px] md:items-center"><div><strong>{product.name}</strong><p className="text-sm text-stone-500">{product.category?.name} · Stock {product.stock}</p></div><strong>{formatNaira(product.salePrice || product.price)}</strong><div className="flex gap-2"><button onClick={() => edit(product)} className="rounded-full bg-amber-100 px-4 py-2 text-sm">Edit</button><button onClick={() => remove(product.id)} className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-700">Delete</button></div></div>)}
      </div>
    </section>
  );
}
