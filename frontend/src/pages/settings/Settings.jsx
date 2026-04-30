import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Globe, Moon, Bell, Lock, LogOut, 
  ChevronRight, Camera, ShieldCheck, Sun, CheckCircle2, Star, Zap
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';

export default function Settings() {
  const navigate = useNavigate();
  
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('splitsmart_user') || localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('splitsmart_theme') || 'dark';
  });
  const [currency, setCurrency] = useState(() => localStorage.getItem('splitsmart_currency') || 'INR (₹)');

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem('splitsmart_currency', newCurrency);
    window.location.reload();
  };
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('splitsmart_user');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('splitsmart_theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  const saveSettings = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-24">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-28">
        <h1 className="text-3xl font-black text-white tracking-tight mb-8">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Sidebar (Navigation/Profile) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Profile Summary Card */}
            <div className="p-6 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 p-1 mx-auto shadow-xl shadow-indigo-500/20">
                    <div className="w-full h-full rounded-full bg-[#1E293B] flex items-center justify-center text-3xl font-black text-white uppercase">
                      {(user.name || '?')[0]}
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-400 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-white truncate">{user.name || 'Guest User'}</h2>
                <p className="text-sm text-[#94A3B8] truncate mt-1">{user.email || 'guest@splitsmart.app'}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
              </div>
            </div>

          </div>

          {/* Right Content Area */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Subscription Section */}
            <section className="p-6 rounded-3xl bg-gradient-to-br from-[#1e1c4b] to-[#1E293B] border border-indigo-500/30 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Zap className="w-24 h-24 text-indigo-400 blur-2xl absolute -top-4 -right-4" />
              </div>
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Subscription
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">SplitSmart Basic</h4>
                    <p className="text-sm text-indigo-200/70">Upgrade to Pro for advanced analytics and AI insights.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/pro')}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 shrink-0"
                  >
                    <Zap className="w-4 h-4" /> Upgrade to Pro
                  </button>
                </div>
              </div>
            </section>

            {/* Preferences Section */}
            <section className="p-6 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" /> Preferences
              </h3>
              
              <div className="space-y-6">
                {/* Currency */}
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Base Currency</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Used for all calculations and displays.</p>
                  </div>
                  <select 
                    value={currency}
                    onChange={handleCurrencyChange}
                    className="px-4 py-2 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm font-semibold focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                  >
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>

                <div className="h-px bg-[#334155] w-full" />

                {/* Theme */}
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Interface Theme</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Select your preferred color scheme.</p>
                  </div>
                  <div className="flex items-center p-1 rounded-xl bg-[#0F172A] border border-[#334155]">
                    <button 
                      onClick={() => handleThemeChange('light')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-[#1E293B] text-white shadow-sm' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button 
                      onClick={() => handleThemeChange('dark')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-[#1E293B] text-indigo-400 shadow-sm border border-indigo-500/30' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Notifications Section */}
            <section className="p-6 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" /> Notifications
              </h3>
              
              <div className="space-y-6">
                {/* Email Notifs */}
                <div className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => setEmailNotifs(!emailNotifs)}>
                  <div>
                    <p className="text-sm font-semibold text-white">Email Notifications</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Receive expense and settlement emails.</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${emailNotifs ? 'bg-emerald-500' : 'bg-[#334155]'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${emailNotifs ? 'translate-x-7' : 'translate-x-1'}`} />
                  </div>
                </div>

                <div className="h-px bg-[#334155] w-full" />

                {/* Push Notifs */}
                <div className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => setPushNotifs(!pushNotifs)}>
                  <div>
                    <p className="text-sm font-semibold text-white">Push Notifications</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Get real-time browser alerts.</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${pushNotifs ? 'bg-emerald-500' : 'bg-[#334155]'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${pushNotifs ? 'translate-x-7' : 'translate-x-1'}`} />
                  </div>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className="p-6 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" /> Security
              </h3>
              
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#0F172A] border border-[#334155] hover:border-[#475569] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1E293B] text-[#94A3B8] group-hover:text-white transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-white">Change Password</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#475569] group-hover:translate-x-1 transition-transform" />
                </button>

                <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-rose-400">Sign Out Everywhere</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400/50 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button 
                onClick={saveSettings}
                className="px-8 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
              >
                {saving ? 'Saving...' : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
