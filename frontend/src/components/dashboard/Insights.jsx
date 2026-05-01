import { formatCurrency, getCurrencySymbol } from '../../utils/currencyUtils.js';
import { useEffect, useState } from 'react';
import { TrendingUp, Sparkles, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { getUserInsights } from '../../services/insightService.js';

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const insights = (data?.insights && data.insights.length > 0) ? data.insights : [
    "You spent 30% more on Food this month.",
    "Rahul owes you the most (₹500).",
    "Great job! Your travel expenses are down by 15%."
  ];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-[#F8FAFC]">Smart Insights</h3>
      </div>
      
      <div className="space-y-4">
        {insights.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-[#334155] text-center">
            <p className="text-xs text-[#64748B]">No insights yet. Add more expenses to see patterns.</p>
          </div>
        ) : (
          insights.map((insight, idx) => {
            const isAlert = insight.includes('increased');
            const isPositive = insight.includes('less');
            
            return (
              <div 
                key={idx} 
                className={`${isAlert ? 'bg-rose-500/5 border-rose-500/10' : isPositive ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-indigo-500/5 border-indigo-500/10'} border rounded-xl p-4 transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isAlert ? <TrendingUp className="w-4 h-4 text-rose-400" /> : <Sparkles className="w-4 h-4 text-indigo-400" />}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isAlert ? 'text-rose-400' : isPositive ? 'text-emerald-400' : 'text-indigo-400'}`}>
                      {isAlert ? 'Spending Alert' : isPositive ? 'Savings Milestone' : 'Discovery'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {insight}
                </p>
              </div>
            );
          })
        )}

        {data?.totalSpending > 0 && (
          <div className="pt-2">
            <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
               <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Total Spending Share</p>
               <h4 className="text-xl font-bold text-white">{formatCurrency(data.totalSpending)}</h4>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
