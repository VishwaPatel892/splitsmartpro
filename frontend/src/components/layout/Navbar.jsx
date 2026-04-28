import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#334155] px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-white text-xl tracking-tight">
        SplitSmart<span className="text-indigo-400">Pro</span>
      </Link>

      <div className="flex items-center gap-1">
        {navLink('/dashboard', 'Dashboard', LayoutDashboard)}
        {navLink('/groups', 'Groups', Users)}
      </div>
    </nav>
  );
}

