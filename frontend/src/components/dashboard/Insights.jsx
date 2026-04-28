import { TrendingUp, PieChart, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';

const insights = [
  { 
    id: 1, 
    title: 'Spending Surge', 
    desc: 'You spent 32% more on food this week compared to last month.', 
    icon: <TrendingUp className="w-4 h-4" />, 
    color: 'text-amber-400',
    bg: 'bg-amber-400/10' 
  },
  { 
    id: 2, 
    title: 'Quick Settlement', 
    desc: 'Rahul owes you the most (₹2,450). Settle up now?', 
    icon: <Sparkles className="w-4 h-4" />, 
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10' 
  },
];

export default function Insights() {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-[#F8FAFC]">Smart Insights</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`${insight.bg} border border-white/5 rounded-xl p-4 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group/item shadow-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={insight.color}>{insight.icon}</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${insight.color}`}>{insight.title}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-white/20 group-hover/item:text-white group-hover/item:translate-x-0.5 transition-all" />
            </div>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              {insight.desc}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}
