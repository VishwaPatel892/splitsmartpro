import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

import StatCard from '../../components/dashboard/StatCard';
import QuickActions from '../../components/dashboard/QuickActions';
import AnalyticsChart from '../../components/dashboard/AnalyticsChart';
import ExpenseList from '../../components/dashboard/ExpenseList';
import GroupList from '../../components/dashboard/GroupList';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import Insights from '../../components/dashboard/Insights';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-12">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 pt-24">
          <div className="mb-8 space-y-2">
            <div className="h-9 w-48 bg-[#1E293B] rounded-xl animate-pulse" />
            <div className="h-4 w-64 bg-[#1E293B] rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-[500px] bg-[#1E293B] rounded-2xl animate-pulse" />
            <div className="lg:col-span-4 h-[500px] bg-[#1E293B] rounded-2xl animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-12">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-24">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-[#94A3B8] mt-1">Welcome back, here's what's happening with your finances.</p>
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-widest bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-2 hover:border-indigo-500/50 hover:text-[#F8FAFC] transition-all cursor-pointer group active:scale-95">
            Last updated: <span className="text-indigo-400 ml-1 group-hover:text-indigo-300">2 mins ago</span>
            <svg className="w-3 h-3 ml-1 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Balance" 
            amount={124500} 
            type="neutral" 
            trend="+12%" 
            description="Across all accounts"
          />
          <StatCard 
            title="You Are Owed" 
            amount={45800} 
            type="positive" 
            trend="+5.4%" 
            description="From 8 people"
          />
          <StatCard 
            title="You Owe" 
            amount={12400} 
            type="negative" 
            trend="-2.1%" 
            description="To 3 people"
          />
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-xl shadow-indigo-500/20 flex flex-col justify-between group cursor-pointer hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98] transition-all">
             <div className="flex justify-between items-start">
               <div className="p-2 rounded-xl bg-white/20">
                 <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded text-white">Pro Plan</span>
             </div>
             <div>
               <p className="text-indigo-100 text-xs font-bold mb-1 uppercase tracking-wider">Estimated Savings</p>
               <h3 className="text-2xl font-bold text-white">₹8,200</h3>
             </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Charts & Expenses) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="min-h-[380px]">
                <AnalyticsChart />
              </div>
              <div className="min-h-[380px]">
                <Insights />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ExpenseList />
              <GroupList />
            </div>
          </div>

          {/* Right Column (Activity & Side Panel) */}
          <div className="lg:col-span-4 space-y-8 h-full">
            <div className="min-h-[380px] lg:h-full">
               <ActivityFeed />
            </div>
            
            {/* Promo Card */}
            <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-6 relative overflow-hidden group cursor-pointer hover:border-indigo-500/50 transition-all active:scale-[0.98]">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
              <h4 className="text-sm font-bold text-white mb-2 relative z-10">Smart Split™ Enabled</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed relative z-10">
                Our algorithm just simplified 4 debts across your groups, saving you 2 transactions.
              </p>
              <button className="mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group/btn">
                View Optimization Report <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
