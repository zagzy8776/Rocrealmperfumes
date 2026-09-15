import { useEffect, useState } from 'react';
import { Trash2, Upload, X } from 'lucide-react';
import { api } from '../../lib/api.js';

const empty = { title: '', message: '', linkLabel: 'Shop now', linkUrl: '/shop', isActive: true, startsAt: '', endsAt: '', imageUrl: '' };

export default function AdminPromos() {
  const [banners, setBanners] = useState([]); const [form, setForm] = useState(empty); const [editing, setEditing] = useState(null); const [message, setMessage] = useState(''); const [uploading, setUploading] = useState(false); const [previewUrl, setPreviewUrl] = useState('');
  const load = () => api.get('/promos').then((res) => setBanners(res.data.banners));
  useEffect(() => { load().catch(() => null); }, []);
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({ ...form, imageUrl: res.data.url });
      setPreviewUrl(res.data.url);
    } catch (err) {
      setMessage('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm({ ...form, imageUrl: '' });
    setPreviewUrl('');
  };

  const submit = async (e) => { e.preventDefault(); const payload = { ...form, startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null, endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null }; if (editing) await api.put(`/promos/${editing}`, payload); else await api.post('/promos', payload); setForm(empty); setEditing(null); setPreviewUrl(''); setMessage('Promo saved.'); load(); };
  const edit = (b) => { setEditing(b.id); setForm({ ...b, startsAt: b.startsAt ? b.startsAt.slice(0, 10) : '', endsAt: b.endsAt ? b.endsAt.slice(0, 10) : '' }); setPreviewUrl(b.imageUrl || ''); };
  const remove = async (id) => { if (confirm('Delete promo?')) { await api.delete(`/promos/${id}`); load(); } };
  return <section className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.28em] text-amber-700">Promotions</p><h1 className="mt-2 font-display text-4xl font-semibold">Promo Banners</h1>{message && <p className="mt-4 rounded-2xl bg-green-50 p-4 text-green-700">{message}</p>}
    <form onSubmit={submit} className="mt-8 grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm md:grid-cols-2">
      <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
      <input placeholder="Link URL" value={form.linkUrl || ''} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
      <textarea required placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="min-h-24 rounded-2xl bg-stone-100 px-4 py-3 outline-none md:col-span-2" />
      <input placeholder="Link label" value={form.linkLabel || ''} onChange={(e) => setForm({ ...form, linkLabel: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
      
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-semibold">Banner Image</label>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-amber-900 hover:bg-amber-200 cursor-pointer"
            >
              <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Image'}
            </label>
          </div>
          {previewUrl && (
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="h-20 w-32 rounded-xl object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <button disabled={uploading} className="rounded-full bg-stone-950 px-6 py-4 font-semibold text-white md:col-span-2 disabled:opacity-50">{editing ? 'Update' : 'Add'} Promo</button>
    </form>
    <div className="mt-6 grid gap-4">{banners.map((b) => <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center gap-4">{b.imageUrl && <img src={b.imageUrl} alt={b.title} className="h-16 w-24 rounded-xl object-cover" />}<div><strong>{b.title}</strong><p className="text-sm text-stone-500">{b.message}</p></div>}</div><div className="flex gap-2"><button onClick={() => edit(b)} className="rounded-full bg-amber-50 px-4 py-2 text-amber-800">Edit</button><button onClick={() => remove(b.id)} className="rounded-full bg-red-50 p-3 text-red-600"><Trash2 size={16} /></button></div></div>)}</div>
  </section>;
}