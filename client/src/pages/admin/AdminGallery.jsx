import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, ImagePlus, Star, Trash2, UploadCloud } from 'lucide-react';
import { api } from '../../lib/api.js';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({ title: '', caption: '', isFeatured: false, isActive: true });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/gallery/admin/all').then((res) => setImages(res.data.images)).catch((err) => setError(err.response?.data?.message || 'Unable to load gallery.'));
  useEffect(() => { load(); }, []);

  const chooseFile = (selectedFile) => {
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : '');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!file) return setError('Please choose a picture from your phone/gallery first.');
    setLoading(true);
    try {
      const body = new FormData();
      body.append('image', file);
      body.append('title', form.title);
      body.append('caption', form.caption);
      body.append('isFeatured', String(form.isFeatured));
      body.append('isActive', String(form.isActive));
      await api.post('/gallery', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ title: '', caption: '', isFeatured: false, isActive: true });
      chooseFile(null);
      setMessage('Gallery image uploaded successfully.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Check Cloudinary setup on Render.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (image, key) => {
    await api.put(`/gallery/${image.id}`, { title: image.title, caption: image.caption, isFeatured: key === 'isFeatured' ? !image.isFeatured : image.isFeatured, isActive: key === 'isActive' ? !image.isActive : image.isActive });
    load();
  };

  const remove = async (id) => {
    if (confirm('Delete this gallery image?')) {
      await api.delete(`/gallery/${id}`);
      setMessage('Gallery image deleted.');
      load();
    }
  };

  return (
    <section className="p-6 lg:p-10">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-amber-700">Media</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Gallery</h1>
        <p className="mt-2 text-stone-600">Upload pictures directly from phone gallery. They will appear on the public Gallery page.</p>
      </div>

      {message && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700"><CheckCircle2 size={18} /> {message}</div>}
      {error && <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700"><AlertCircle size={18} /> {error}</div>}

      <form onSubmit={submit} className="mt-8 grid gap-6 rounded-[2.5rem] bg-white p-6 shadow-sm lg:grid-cols-[320px_1fr]">
        <label className="grid min-h-80 cursor-pointer place-items-center overflow-hidden rounded-[2rem] border-2 border-dashed border-amber-300 bg-amber-50 text-center">
          {preview ? <img src={preview} alt="Preview" className="h-full w-full object-cover" /> : <div className="p-8"><ImagePlus className="mx-auto text-amber-700" size={48} /><p className="mt-4 font-semibold">Tap to choose picture</p><p className="mt-2 text-sm text-stone-500">Works from phone gallery/camera.</p></div>}
          <input type="file" accept="image/*" onChange={(e) => chooseFile(e.target.files?.[0])} className="hidden" />
        </label>
        <div className="grid content-start gap-4">
          <input placeholder="Title optional" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
          <textarea placeholder="Caption optional" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="min-h-28 rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured image</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Show publicly</label>
          <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-4 font-semibold text-white hover:bg-amber-700 disabled:opacity-60"><UploadCloud size={18} /> {loading ? 'Uploading...' : 'Upload to Gallery'}</button>
        </div>
      </form>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {images.map((image) => (
          <article key={image.id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <img src={image.imageUrl} alt={image.title || 'Gallery'} className="h-72 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-xl font-semibold">{image.title || 'Untitled'}</h2><p className="mt-1 text-sm text-stone-500">{image.caption || 'No caption'}</p></div>{image.isFeatured && <Star className="text-amber-500" size={18} />}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => toggle(image, 'isFeatured')} className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-900">{image.isFeatured ? 'Unfeature' : 'Feature'}</button>
                <button onClick={() => toggle(image, 'isActive')} className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-800">{image.isActive ? 'Hide' : 'Show'}</button>
                <button onClick={() => remove(image.id)} className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-700"><Trash2 size={15} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
