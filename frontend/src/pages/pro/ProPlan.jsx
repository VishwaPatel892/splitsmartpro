import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Zap, ArrowLeft, Star, Shield, PieChart, Sparkles, Download } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

export default function ProPlan() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  const features = [
    { name: 'Unlimited Groups', free: true, pro: true },
    { name: 'Basic Expense Tracking', free: true, pro: true },
    { name: 'Advanced Analytics', free: false, pro: true },
    { name: 'AI Spending Insights', free: false, pro: true },
    { name: 'Export to CSV / PDF', free: false, pro: true },
    { name: 'Priority Support', free: false, pro: true },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-24">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-28">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative">
          <button 
            onClick={() => navigate(-1)}
            className="absolute -left-12 top-2 p-2 text-[#64748B] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-up">
            <Star className="w-4 h-4" /> Level Up Your Finances
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">SplitSmart Pro</span>
          </h1>
          <p className="text-[#94A3B8] text-lg animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Get powerful analytics, AI-driven insights, and unlimited everything. Take full control of your shared expenses.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-[#1E293B] p-1.5 rounded-2xl flex items-center gap-1 border border-[#334155]">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!isAnnual ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
            >
              Annually <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          
          {/* Free Plan */}
          <div className="p-8 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
            <p className="text-[#94A3B8] text-sm mb-6">Perfect for small groups and casual trips.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">₹0</span>
              <span className="text-[#64748B] font-semibold">/forever</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {features.filter(f => f.free).map(feature => (
                <li key={feature.name} className="flex items-center gap-3 text-[#CBD5E1]">
                  <CheckCircle2 className="w-5 h-5 text-[#64748B]" />
                  <span className="text-sm font-semibold">{feature.name}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-4 rounded-xl bg-[#0F172A] text-white font-bold border border-[#334155] hover:border-[#475569] transition-all">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1e1c4b] to-[#1E293B] border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 relative overflow-hidden flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-24 h-24 bg-indigo-500/20 blur-3xl rounded-full absolute -top-4 -right-4" />
              <Zap className="w-8 h-8 text-indigo-400 relative z-10" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-indigo-200/70 text-sm mb-6">For power users who want deep insights.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">₹{isAnnual ? '199' : '249'}</span>
              <span className="text-[#64748B] font-semibold">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              {features.map(feature => (
                <li key={feature.name} className="flex items-center gap-3 text-white">
                  {feature.pro ? (
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#334155]" />
                  )}
                  <span className="text-sm font-semibold">{feature.name}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all relative z-10">
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Features Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] text-center">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
              <PieChart className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold mb-2">Advanced Analytics</h4>
            <p className="text-sm text-[#94A3B8]">Deep dive into your spending habits with interactive, beautiful charts and graphs.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] text-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold mb-2">AI Insights</h4>
            <p className="text-sm text-[#94A3B8]">Get smart recommendations on how to save money and settle debts efficiently.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] text-center">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-rose-400">
              <Download className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold mb-2">Export Anywhere</h4>
            <p className="text-sm text-[#94A3B8]">Download your data in CSV or PDF formats for accounting and personal records.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
