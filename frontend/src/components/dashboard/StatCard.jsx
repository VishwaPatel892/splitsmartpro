import { formatCurrency, getCurrencySymbol } from '../../utils/currencyUtils.js';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function StatCard({ title, amount, type, trend, description, onClick }) {
  const isPositive = type === 'positive';
  const isNeutral = type === 'neutral';

  return (
    <div 
      onClick={onClick}
      className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-[#1E293B]/80 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer active:scale-[0.98]"
    >

      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-2.5 rounded-xl",
          isNeutral ? "bg-indigo-500/10 text-indigo-400" : 
          isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
        )}>
          <Wallet className="w-5 h-5" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
            trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      
      <p className="text-sm font-medium text-[#94A3B8] mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">{formatCurrency(amount)}</h3>
      
      {description && (
        <p className="mt-2 text-xs text-[#64748B] flex items-center gap-1">
          {description}
        </p>
      )}
    </div>
  );
}
