import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LineChart, Zap, Sun, Moon } from 'lucide-react';
import NotificationPanel from './NotificationPanel.jsx';

export default function Navbar() {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('splitsmart_theme') || 'dark');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('splitsmart_theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  const navLink = (to, label, Icon) => {
    const isActive = pathname === to;
    return (
      <Link
        to={to}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all group overflow-hidden
          ${isActive
            ? 'text-indigo-300 bg-indigo-500/10'
            : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
          }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
        <span className="relative z-10">{label}</span>
        {/* Glow/Underline Indicator */}
        {isActive && (
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-500 shadow-[0_0_10px_2px_rgba(99,102,241,0.5)] animate-fade-in" />
        )}
      </Link>
    );
  };

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
          {navLink('/pro', 'Pro Plan', Zap)}
        </div>
        
        {/* User Profile / Notifications / Theme */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#334155]">
           <button onClick={toggleTheme} className="w-8 h-8 rounded-xl border border-[#334155] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors" title="Toggle Theme">
             {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
           <NotificationPanel />
           
           <div className="relative">
             <button 
               onClick={() => setIsProfileOpen(!isProfileOpen)} 
               className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs uppercase hover:bg-indigo-500/30 hover:scale-105 transition-all cursor-pointer focus:outline-none"
             >
               {user?.name ? user.name[0] : 'U'}
             </button>
             
             {isProfileOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-[#1E293B] border border-[#334155] rounded-xl shadow-xl overflow-hidden z-50 animate-fade-up origin-top-right">
                 <div className="p-3 border-b border-[#334155]">
                   <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                   <p className="text-xs text-[#64748B] truncate">{user?.email || 'user@example.com'}</p>
                 </div>
                 <div className="p-1">
                   <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-3 py-2 text-sm text-[#94A3B8] hover:text-white hover:bg-[#334155] rounded-lg transition-colors">
                     Profile
                   </Link>
                   <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="block px-3 py-2 text-sm text-[#94A3B8] hover:text-white hover:bg-[#334155] rounded-lg transition-colors">
                     Settings
                   </Link>
                   <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors">
                     Logout
                   </button>
                 </div>
               </div>
             )}
           </div>
        </div>
      </div>
    </nav>
  );
}

