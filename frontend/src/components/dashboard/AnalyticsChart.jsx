import { formatCurrency, getCurrencySymbol } from '../../utils/currencyUtils.js';
import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Loader2, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { getUserInsights } from '../../services/insightService.js';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4'];

export default function AnalyticsChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('trend'); // 'trend' | 'category'

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUserInsights();
        setData(res);
      } catch (err) {
        console.error('Insights fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 h-full flex items-center justify-center min-h-[380px]">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const hasData = data && (data.monthlyTrend.length > 0 || data.categoryBreakdown.length > 0);

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 h-full flex flex-col hover:border-indigo-500/50 transition-all group/chart">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">Spending Analytics</h3>
          <p className="text-sm text-[#94A3B8]">
            {view === 'trend' ? 'Your monthly expense flow' : 'Breakdown by category'}
          </p>
        </div>
        <div className="flex bg-[#0F172A] rounded-lg p-1 border border-[#334155]">
          <button 
            onClick={() => setView('trend')}
            className={`p-1.5 rounded-md transition-all ${view === 'trend' ? 'bg-indigo-600 text-white' : 'text-[#64748B] hover:text-white'}`}
            title="Trend View"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('category')}
            className={`p-1.5 rounded-md transition-all ${view === 'category' ? 'bg-indigo-600 text-white' : 'text-[#64748B] hover:text-white'}`}
            title="Category View"
          >
            <PieIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[240px]">
        {!hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-[#64748B]">
            <TrendingUp className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-xs">Not enough data to display charts</p>
          </div>
        ) : view === 'trend' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlyTrend}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 10 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#F8FAFC'
                }}
                itemStyle={{ color: '#6366F1', fontSize: '12px', fontWeight: 'bold' }}
                formatter={(value) => [`${formatCurrency(value)}`, 'Amount']}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#6366F1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAmt)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#F8FAFC'
                }}
                itemStyle={{ fontSize: '12px' }}
                formatter={(value) => [`${formatCurrency(value)}`, 'Spent']}
              />
              <Legend 
                iconType="circle" 
                wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                formatter={(value) => <span className="text-[#94A3B8]">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
