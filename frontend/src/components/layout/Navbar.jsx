import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LineChart } from 'lucide-react';
import NotificationPanel from './NotificationPanel.jsx';

export default function Navbar() {
  const { pathname } = useLocation();

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        ${pathname === to
          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
          : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
        }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('splitsmart_user') || localStorage.getItem('user') || '{}'); }
    catch { return null; }
  })();

  const handleLogout = () => {
    localStorage.removeItem('splitsmart_user');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#334155] px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-white text-xl tracking-tight">
        SplitSmart<span className="text-indigo-400">Pro</span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1">
          {navLink('/dashboard', 'Dashboard', LayoutDashboard)}
          {navLink('/groups', 'Groups', Users)}
          {navLink('/analytics', 'Analytics', LineChart)}
        </div>
        
        {/* User Profile / Notifications */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#334155]">
           <NotificationPanel />
           <Link to="/settings" className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs uppercase hover:bg-indigo-500/30 hover:scale-105 transition-all cursor-pointer" title="Settings">
             {user?.name ? user.name[0] : 'U'}
           </Link>
           <button onClick={handleLogout} className="hidden sm:block text-xs font-semibold text-[#94A3B8] hover:text-rose-400 transition-colors">
             Logout
           </button>
        </div>
      </div>
    </nav>
  );
}

