import { useNavigate } from 'react-router-dom';
import { Plus, Users, Receipt, ArrowUpRight } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      name: 'Add Expense',
      icon: <Plus className="w-5 h-5" />,
      color: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30',
      onClick: () => {},           // Phase 4
    },
    {
      name: 'My Groups',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-[#0F172A] border border-[#334155] hover:border-indigo-500/50',
      onClick: () => navigate('/groups'),
    },
    {
      name: 'Settle Up',
      icon: <Receipt className="w-5 h-5" />,
      color: 'bg-[#0F172A] border border-[#334155] hover:border-emerald-500/50',
      onClick: () => {},           // Phase 4
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {actions.map((action) => (
        <button
          key={action.name}
          onClick={action.onClick}
          className={`${action.color} rounded-2xl p-4 flex items-center justify-between group transition-all duration-300 shadow-lg active:scale-[0.97]`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <span className="font-bold text-white text-sm">{action.name}</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </button>
      ))}
    </div>
  );
}
