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

// --- Dummy Data ---
const MONTHLY_DATA = [
  { name: 'Jan', amount: 4000 }, { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 }, { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 6890 }, { name: 'Jun', amount: 8390 },
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [timeRange, selectedGroup]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] font-sans">
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

          <div className="flex items-center gap-3">
            {/* Group Filter */}
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-indigo-500/50 transition-colors">
                <Filter className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-sm font-semibold text-white">{selectedGroup}</span>
                <ChevronDown className="w-4 h-4 text-[#64748B] group-hover:text-white transition-colors" />
              </div>
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
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">Overspending Alert</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Your spending increased by <span className="text-rose-400 font-bold">18%</span> compared to last month. Watch your entertainment budget.
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight Card 2 */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">Pending Dues Reminder</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      You have <span className="text-amber-400 font-bold">{formatCurrency(2400)}</span> in pending dues. Settle them soon to avoid piling up debt.
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight Card 3 */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">Behavior Tip</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Highest expense category is <span className="text-emerald-400 font-bold">Food</span>. Cooking at home twice a week could save you ${formatCurrency(3)}k/mo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Trend (Line Chart) */}
          <div className="p-6 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#94A3B8]" /> Monthly Spending Trend
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${formatCurrency(val)}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#818CF8', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#818CF8" strokeWidth={3} dot={{ r: 4, fill: '#818CF8', strokeWidth: 2, stroke: '#1E293B' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Split (Pie Chart) */}
          <div className="p-6 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg flex flex-col">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#94A3B8]" /> Category Breakdown
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value) => `${formatCurrency(value)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {CATEGORY_DATA.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-xs font-semibold text-[#94A3B8]">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Group Comparison (Bar Chart) */}
          <div className="p-6 rounded-3xl bg-[#1E293B] border border-[#334155] shadow-lg lg:col-span-2">
            <h3 className="text-sm font-bold text-white mb-6">Group-wise Comparison</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={GROUP_DATA} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${formatCurrency(val)}`} />
                  <RechartsTooltip 
                    cursor={{ fill: '#475569', opacity: 0.2 }}
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #475569', borderRadius: '12px', color: '#F8FAFC' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: '#94A3B8' }} />
                  <Bar dataKey="spent" name="Spent" fill="#818CF8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="limit" name="Budget Limit" fill="#475569" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
