import { formatCurrency, getCurrencySymbol } from '../../utils/currencyUtils.js';
import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, History, Loader2, IndianRupee } from 'lucide-react';
import api from '../../services/api';

export default function SettlementHistory({ refreshKey }) {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settlements/recent')
      .then(res => setSettlements(res.data))
      .catch(() => setSettlements([]))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-400" />
          Settlement History
        </h3>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />}
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {!loading && settlements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-[#475569]">
            <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm">No settlements yet</p>
          </div>
        )}

        {settlements.map((s) => (
          <div key={s._id} className="rounded-xl bg-[#0F172A] border border-[#334155] p-3.5 hover:border-emerald-500/30 transition-all group">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F8FAFC] mb-1">
                  <span className="truncate">{s.fromUser?.name}</span>
                  <ArrowRight className="w-3 h-3 text-[#475569]" />
                  <span className="truncate">{s.toUser?.name}</span>
                </div>
                <p className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">
                  In {s.groupId?.name}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-emerald-400">{formatCurrency(s.amount)}</p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500/70 uppercase tracking-widest">Completed</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#334155]">
         <p className="text-[10px] text-[#475569] font-bold uppercase tracking-widest text-center">Showing last {settlements.length} payments</p>
      </div>
    </div>
  );
}
