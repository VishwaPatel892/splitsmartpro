import { formatCurrency, getCurrencySymbol } from '../../utils/currencyUtils.js';
import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, Lightbulb, Zap, Calendar, 
  Filter, ChevronDown, Activity, Sparkles 
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import PageSEO from '../../components/common/PageSEO.jsx';
import { trackPageView } from '../../utils/analytics.js';

// --- Dummy Data ---
const MONTHLY_DATA = [
  { name: 'Jan', amount: 4000 }, { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 }, { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 6890 }, { name: 'June', amount: 8500 },
];

const CATEGORY_DATA = [
  { name: 'Food', value: 4500, color: '#818CF8' },
  { name: 'Travel', value: 3000, color: '#34D399' },
  { name: 'Rent', value: 8000, color: '#F87171' },
  { name: 'Entertainment', value: 2000, color: '#FBBF24' },
];

const GROUP_DATA = [
  { name: 'Goa Trip', spent: 12000, limit: 15000 },
  { name: 'Apartment', spent: 8000, limit: 10000 },
  { name: 'Weekend Party', spent: 3500, limit: 3000 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('Month'); // Week | Month | Year
  const [selectedGroup, setSelectedGroup] = useState('All Groups');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [barChartTime, setBarChartTime] = useState('This Month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView('/analytics', 'Analytics | SplitSmart Pro');
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [timeRange, selectedGroup, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-24">
        <PageSEO title="Analytics" description="Deep dive into your financial habits with advanced charts and AI insights." path="/analytics" />
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-28 space-y-6">
          <div className="h-10 w-48 bg-[#1E293B] rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-[#1E293B] rounded-2xl animate-pulse" />
            <div className="h-40 bg-[#1E293B] rounded-2xl animate-pulse" />
            <div className="h-40 bg-[#1E293B] rounded-2xl animate-pulse" />
          </div>
          <div className="h-96 bg-[#1E293B] rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-24">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-24 space-y-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-indigo-400" /> Advanced Analytics
            </h1>
            <p className="text-[#64748B] text-sm mt-1">Deep dive into your financial habits</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="relative group cursor-pointer">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none outline-none flex items-center gap-2 pl-4 pr-8 py-2 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-indigo-500/50 transition-colors text-sm font-semibold text-white"
              >
                <option value="All Categories">All Categories</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Rent">Rent</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none group-hover:text-white transition-colors" />
            </div>

            {/* Group Filter */}
            <div className="relative group cursor-pointer">
              <select 
                value={selectedGroup} 
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="appearance-none outline-none flex items-center gap-2 pl-4 pr-8 py-2 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-indigo-500/50 transition-colors text-sm font-semibold text-white"
              >
                <option value="All Groups">All Groups</option>
                <option value="Goa Trip">Goa Trip</option>
                <option value="Apartment">Apartment</option>
                <option value="Weekend Party">Weekend Party</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none group-hover:text-white transition-colors" />
            </div>
            
            {/* Time Filter */}
            <div className="flex items-center p-1 rounded-xl bg-[#1E293B] border border-[#334155]">
              {['Week', 'Month', 'Year'].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === t 
                      ? 'bg-indigo-500 text-white shadow-md' 
                      : 'text-[#64748B] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Smart AI Insights Panel */}
        <section className="relative p-6 rounded-3xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#334155] shadow-2xl overflow-hidden">
          {/* Subtle Glow Backgrounds */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-300 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Smart Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Insight Card 1 */}
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-400 text-sm mb-1">Spending Alert</h3>
                    <p className="text-xs text-white leading-relaxed font-medium">
                      You spent <span className="font-bold text-rose-300">32% more</span> this month than last month
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight Card 2 */}
              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-400 text-sm mb-1">Top Category</h3>
                    <p className="text-xs text-white leading-relaxed font-medium">
                      <span className="font-bold text-indigo-300">Food</span> is your highest expense category
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight Card 3 */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-400 text-sm mb-1">Top Group</h3>
                    <p className="text-xs text-white leading-relaxed font-medium">
                      <span className="font-bold text-amber-300">Goa Trip</span> has the highest spending
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Grid or Empty State */}
        {MONTHLY_DATA.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#1E293B]/50 rounded-3xl border border-dashed border-[#334155] shadow-lg">
            <div className="w-20 h-20 rounded-2xl bg-[#0F172A] border border-[#334155] flex items-center justify-center mb-5 shadow-inner">
              <Activity className="w-10 h-10 text-[#475569]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No analytics yet</h3>
            <p className="text-sm text-[#94A3B8] max-w-sm mx-auto">Add expenses to see insights</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Trend (Line Chart) */}
          <div className="p-6 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg relative group transition-all hover:shadow-xl hover:border-indigo-500/30">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#94A3B8]" /> Monthly Spending Trend
              </h3>
              <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs font-bold text-rose-400 flex items-center gap-1">
                Peak spending: {formatCurrency(8500)} in June
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${formatCurrency(val)}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#818CF8', fontWeight: 'bold' }}
                    labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
                    formatter={(value) => [`${formatCurrency(value)}`, 'Spent']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#818CF8" 
                    strokeWidth={3} 
                    animationDuration={1500}
                    dot={{ r: 4, fill: '#818CF8', strokeWidth: 2, stroke: '#1E293B' }} 
                    activeDot={{ r: 8, stroke: '#818CF8', strokeWidth: 2, fill: '#fff' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Split (Pie Chart) */}
          <div className="p-6 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg flex flex-col relative group transition-all hover:shadow-xl hover:border-indigo-500/30">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#94A3B8]" /> Category Breakdown
            </h3>
            <div className="flex-1 flex items-center justify-center relative">
              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-widest">Total Spent</span>
                <span className="text-xl font-bold text-white">{formatCurrency(17500)}</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="cursor-pointer hover:opacity-80 transition-opacity outline-none"
                        onClick={() => setSelectedCategory(entry.name)}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value, name) => [
                      `${formatCurrency(value)} (${((value / 17500) * 100).toFixed(0)}%)`, 
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {CATEGORY_DATA.map(c => (
                <button 
                  key={c.name} 
                  onClick={() => setSelectedCategory(c.name)}
                  className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${selectedCategory === c.name ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: c.color }} />
                  <span className={`text-xs font-semibold ${selectedCategory === c.name ? 'text-white' : 'text-[#94A3B8]'}`}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group Comparison (Bar Chart) */}
          <div className="p-6 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg lg:col-span-2 group transition-all hover:shadow-xl hover:border-indigo-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-white">Group-wise Comparison</h3>
                <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1">
                  Top Spender: Goa Trip
                </span>
              </div>
              <div className="flex items-center p-1 rounded-lg bg-[#0F172A] border border-[#334155]">
                {['This Month', 'All Time'].map(t => (
                  <button
                    key={t}
                    onClick={() => setBarChartTime(t)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      barChartTime === t 
                        ? 'bg-[#334155] text-white shadow-sm' 
                        : 'text-[#64748B] hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={GROUP_DATA} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${formatCurrency(val)}`} />
                  <RechartsTooltip 
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #475569', borderRadius: '12px', color: '#F8FAFC' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value) => `${formatCurrency(value)}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: '#94A3B8' }} iconType="circle" />
                  <Bar dataKey="spent" name="Spent" fill="#818CF8" radius={[6, 6, 0, 0]} animationDuration={1500} />
                  <Bar dataKey="limit" name="Budget Limit" fill="#475569" radius={[6, 6, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          </div>
        )}
      </main>
    </div>
  );
}
