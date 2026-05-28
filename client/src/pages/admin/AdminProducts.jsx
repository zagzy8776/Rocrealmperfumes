import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Edit3, Image, Plus, Search, Trash2, X } from 'lucide-react';
import { api, formatNaira } from '../../lib/api.js';

const empty = { name: '', description: '', price: '', salePrice: '', size: '', notes: '', images: '', stock: 0, isFeatured: false, isActive: true, categoryId: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [productRes, categoryRes] = await Promise.all([api.get('/products/admin/all'), api.get('/categories')]);
    setProducts(productRes.data.products);
    setCategories(categoryRes.data.categories);
  };

  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || 'Unable to load products.')); }, []);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const filteredProducts = useMemo(() => products.filter((product) => {
    const q = search.toLowerCase();
    return product.name.toLowerCase().includes(q) || product.category?.name?.toLowerCase().includes(q);
  }), [products, search]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
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
      setMessage(editing ? 'Product updated successfully.' : 'Product added successfully.');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product.');
    } finally {
      setLoading(false);
    }
  };

  const edit = (product) => {
    setEditing(product.id);
    setForm({ ...product, salePrice: product.salePrice || '', categoryId: product.categoryId || '', notes: product.notes?.join(', ') || '', images: product.images?.join('\n') || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditing(null); setForm(empty); };

  const remove = async (id) => {
    if (confirm('Delete this product?')) {
      await api.delete(`/products/${id}`);
      setMessage('Product deleted.');
      load();
    }
  };

  const previewImage = form.images.split('\n').map((item) => item.trim()).filter(Boolean)[0];

  return (
    <section className="p-6 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-amber-700">Inventory</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Products</h1>
          <p className="mt-2 text-stone-600">Add designer perfumes, oils, colognes, diffusers, humidifiers, nightwear, and more.</p>
        </div>
        {editing && <button onClick={cancelEdit} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-700 shadow-sm"><X size={16} /> Cancel Edit</button>}
      </div>

      {message && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700"><CheckCircle2 size={18} /> {message}</div>}
      {error && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700"><AlertCircle size={18} /> {error}</div>}

      <form onSubmit={submit} className="mt-6 grid gap-6 rounded-[2.5rem] border border-amber-900/10 bg-white p-6 shadow-sm xl:grid-cols-[1fr_280px]">
        <div className="grid gap-4 lg:grid-cols-2">
          <input required placeholder="Product name" value={form.name} onChange={(e) => update('name', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
          <select value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"><option value="">Select category</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select>
          <input required type="number" placeholder="Price" value={form.price} onChange={(e) => update('price', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
          <input type="number" placeholder="Sale price optional" value={form.salePrice} onChange={(e) => update('salePrice', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
          <input placeholder="Size e.g. 100ml / available sizes" value={form.size || ''} onChange={(e) => update('size', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
          <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
          <textarea required placeholder="Description" value={form.description} onChange={(e) => update('description', e.target.value)} className="min-h-28 rounded-2xl bg-stone-100 px-4 py-3 outline-none lg:col-span-2" />
          <input placeholder="Notes/tags comma separated e.g. Amber, Vanilla, Gift Ready" value={form.notes} onChange={(e) => update('notes', e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none lg:col-span-2" />
          <textarea placeholder="Image URLs, one per line" value={form.images} onChange={(e) => update('images', e.target.value)} className="min-h-24 rounded-2xl bg-stone-100 px-4 py-3 outline-none lg:col-span-2" />
          <div className="flex flex-wrap gap-5 lg:col-span-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} /> Featured product</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} /> Visible in shop</label>
          </div>
          <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-4 font-semibold text-white hover:bg-amber-700 disabled:opacity-60 lg:col-span-2"><Plus size={18} /> {loading ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}</button>
        </div>
        <aside className="rounded-[2rem] bg-stone-950 p-5 text-white">
          <p className="text-sm text-amber-300">Preview</p>
          <div className="mt-4 aspect-square overflow-hidden rounded-[1.5rem] bg-white/10">
            {previewImage ? <img src={previewImage} alt="Preview" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-stone-500"><Image size={40} /></div>}
          </div>
          <h3 className="mt-4 font-display text-2xl">{form.name || 'Product name'}</h3>
          <p className="mt-2 text-sm text-stone-400">{form.description || 'Product description preview will appear here.'}</p>
        </aside>
      </form>

      <div className="mt-8 rounded-[2rem] border border-amber-900/10 bg-white p-4 shadow-sm">
        <label className="flex items-center gap-3 rounded-full bg-stone-100 px-4">
          <Search size={18} className="text-stone-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products or categories..." className="w-full bg-transparent py-3 outline-none" />
        </label>
      </div>

      <div className="mt-5 grid gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="grid gap-4 rounded-[2rem] bg-white p-4 shadow-sm md:grid-cols-[90px_1fr_130px_190px] md:items-center">
            <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80'} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" />
            <div>
              <div className="flex flex-wrap items-center gap-2"><strong>{product.name}</strong>{product.isFeatured && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">Featured</span>}{!product.isActive && <span className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">Hidden</span>}</div>
              <p className="mt-1 text-sm text-stone-500">{product.category?.name || 'No category'} · Stock {product.stock} · {product.size || 'No size'}</p>
            </div>
            <strong>{formatNaira(product.salePrice || product.price)}</strong>
            <div className="flex gap-2"><button onClick={() => edit(product)} className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900"><Edit3 size={15} /> Edit</button><button onClick={() => remove(product.id)} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"><Trash2 size={15} /> Delete</button></div>
          </div>
        ))}
        {!filteredProducts.length && <p className="rounded-[2rem] bg-white p-10 text-center text-stone-500">No products found.</p>}
      </div>
    </section>
  );
}
