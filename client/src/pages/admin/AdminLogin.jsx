import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@rocrealmperfume.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('rrp_admin_token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-stone-950 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-[#fffaf1] p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Admin</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Roc Realm Login</h1>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 grid gap-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl bg-white px-4 py-3 outline-none" placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl bg-white px-4 py-3 outline-none" placeholder="Password" />
          <button className="rounded-full bg-stone-950 px-6 py-4 font-semibold text-white">Login</button>
        </div>
        <p className="mt-4 text-xs text-stone-500">Change this seeded password after deployment by updating ADMIN_PASSWORD and reseeding.</p>
      </form>
    </main>
  );
}
