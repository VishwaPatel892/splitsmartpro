import { Utensils, Car, ShoppingBag, Coffee, ChevronRight } from 'lucide-react';

const expenses = [
  { id: 1, name: 'Dinner at Taj', category: 'Food', amount: 4500, payer: 'You', date: 'Today, 8:30 PM', icon: <Utensils className="w-4 h-4" /> },
  { id: 2, name: 'Uber to Airport', category: 'Transport', amount: 850, payer: 'Rahul', date: 'Yesterday', icon: <Car className="w-4 h-4" /> },
  { id: 3, name: 'Groceries', category: 'Shopping', amount: 2300, payer: 'You', date: '24 Oct', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 4, name: 'Starbucks Coffee', category: 'Drinks', amount: 450, payer: 'Sneha', date: '23 Oct', icon: <Coffee className="w-4 h-4" /> },
];

export default function ExpenseList() {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#F8FAFC]">Recent Expenses</h3>
        <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] p-2.5 -mx-2.5 rounded-xl transition-all active:scale-[0.99] border border-transparent hover:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#334155] flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/50 transition-all shadow-lg">
                {expense.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F8FAFC] group-hover:text-white transition-colors">{expense.name}</p>
                <p className="text-[11px] text-[#64748B] font-medium group-hover:text-[#94A3B8] transition-colors">{expense.payer} · {expense.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#F8FAFC] group-hover:text-indigo-400 transition-colors">₹{expense.amount}</p>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider group-hover:text-indigo-300 transition-colors">{expense.category}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
