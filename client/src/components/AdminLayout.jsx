import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ReceiptText, Settings, LogOut } from 'lucide-react';

const links = [
  ['Dashboard', '/admin', LayoutDashboard],
  ['Products', '/admin/products', Package],
  ['Orders', '/admin/orders', ReceiptText],
  ['Categories & Coupons', '/admin/settings', Settings],
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('rrp_admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 bg-stone-950 p-6 text-white lg:block">
        <h1 className="font-display text-3xl">Roc Realm</h1>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Admin</p>
        <nav className="mt-10 grid gap-2">
          {links.map(([label, path, Icon]) => (
            <NavLink key={path} to={path} end={path === '/admin'} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${isActive ? 'bg-amber-600 text-white' : 'text-stone-300 hover:bg-white/10'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="absolute bottom-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10"><LogOut size={18} /> Logout</button>
      </aside>
      <main className="lg:pl-72">
        <div className="sticky top-0 z-30 flex gap-2 overflow-auto border-b bg-white p-3 lg:hidden">
          {links.map(([label, path]) => <NavLink key={path} to={path} end={path === '/admin'} className="whitespace-nowrap rounded-full bg-stone-100 px-4 py-2 text-sm">{label}</NavLink>)}
          <button onClick={logout} className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-700">Logout</button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
