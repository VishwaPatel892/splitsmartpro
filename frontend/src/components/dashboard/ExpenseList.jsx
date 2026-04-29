import { useEffect, useState } from 'react';
import { 
  Utensils, Car, ShoppingBag, Coffee, ChevronRight, 
  Receipt, Wallet, Zap, MoreHorizontal, Loader2, IndianRupee
} from 'lucide-react';
import api from '../../services/api';

const CATEGORY_ICONS = {
  Food: <Utensils className="w-4 h-4" />,
  Travel: <Car className="w-4 h-4" />,
  Shopping: <ShoppingBag className="w-4 h-4" />,
  Others: <Receipt className="w-4 h-4" />,
  Bills: <Zap className="w-4 h-4" />,
  Rent: <Wallet className="w-4 h-4" />,
};

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent expenses across all groups
    api.get('/expenses/recent')
      .then(res => setExpenses(res.data))
      .catch(() => setExpenses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#F8FAFC]">Recent Expenses</h3>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
      </div>

      <div className="space-y-4 flex-1">
        {!loading && expenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-[#475569]">
            <Receipt className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm">No expenses yet</p>
          </div>
        )}

        {expenses.map((expense) => (
          <div key={expense._id} className="flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] p-2.5 -mx-2.5 rounded-xl transition-all active:scale-[0.99] border border-transparent hover:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#334155] flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/50 transition-all shadow-lg">
                {CATEGORY_ICONS[expense.category] || <MoreHorizontal className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F8FAFC] group-hover:text-white transition-colors truncate max-w-[120px]">{expense.title}</p>
                <p className="text-[11px] text-[#64748B] font-medium group-hover:text-[#94A3B8] transition-colors">
                  {expense.paidBy?.name === 'You' ? 'You paid' : `${expense.paidBy?.name} paid`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#F8FAFC] group-hover:text-indigo-400 transition-colors">₹{expense.amount.toFixed(2)}</p>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider group-hover:text-indigo-300 transition-colors">{expense.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
