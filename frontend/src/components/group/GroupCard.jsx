import { Users, ArrowRight, Crown, Receipt, IndianRupee, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/currencyUtils.js';

const GROUP_GRADIENTS = [
  'from-indigo-500/20 to-violet-500/20 border-indigo-500/30',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  'from-rose-500/20 to-pink-500/20 border-rose-500/30',
  'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  'from-cyan-500/20 to-sky-500/20 border-cyan-500/30',
];

const ICON_COLORS = [
  'text-indigo-400 bg-indigo-500/10',
  'text-emerald-400 bg-emerald-500/10',
  'text-rose-400 bg-rose-500/10',
  'text-amber-400 bg-amber-500/10',
  'text-cyan-400 bg-cyan-500/10',
];

export default function GroupCard({ group, index = 0, onDelete, isCreator }) {
  const navigate = useNavigate();
  const gradient = GROUP_GRADIENTS[index % GROUP_GRADIENTS.length];
  const iconColor = ICON_COLORS[index % ICON_COLORS.length];

  return (
    <div
      className={`relative rounded-3xl border bg-[#1E293B]/40 backdrop-blur-md bg-gradient-to-br ${gradient} p-6 flex flex-col gap-4 shadow-lg
        hover:scale-[1.03] hover:shadow-2xl hover:border-indigo-500/50 hover:brightness-110 transition-all duration-300 group overflow-hidden h-[240px]`}
    >
      {/* Activity Indicator Badge (Mock active if recent) */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#0F172A]/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/5">
         <span className="relative flex h-2 w-2">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
           <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
         </span>
         <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mt-2">
        <div className={`p-2.5 rounded-xl ${iconColor}`}>
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-white text-lg leading-tight truncate">
            {group.name}
          </h3>
          {isCreator && (
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Creator" />
          )}
        </div>
        
        {/* Financial Summary & Last Activity */}
        <div className="space-y-1 mt-2">
          {/* Mock balance calculation based on group._id length for demo */}
          {group.name.length % 2 === 0 ? (
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              You get {formatCurrency((group.name.length * 150) + 200)}
            </p>
          ) : (
            <p className="text-xs font-bold text-rose-400 flex items-center gap-1">
              You owe {formatCurrency((group.name.length * 100) + 150)}
            </p>
          )}
          <p className="text-[11px] text-[#94A3B8] flex items-center gap-1 truncate">
            <Receipt className="w-3 h-3" /> Last: Dinner ({formatCurrency(1200)})
          </p>
        </div>
      </div>

      {/* Default Footer (visible normally) */}
      <div className="flex items-center justify-between transition-opacity duration-300 group-hover:opacity-0 absolute bottom-6 left-6 right-6">
        <div className="flex items-center -space-x-2">
          {group.members.slice(0, 4).map((m, i) => (
            <div
              key={m._id || i}
              title={m.name}
              className="w-7 h-7 rounded-full bg-[#334155] border-2 border-[#0F172A] flex items-center justify-center text-[10px] font-bold text-white uppercase"
            >
              {(m.name || '?')[0]}
            </div>
          ))}
          {group.members.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-[#475569] border-2 border-[#0F172A] flex items-center justify-center text-[10px] font-bold text-white">
              +{group.members.length - 4}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
          <span>{group.members.length} member{group.members.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Hover Quick Actions (visible on hover) */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/groups/${group._id}`); }}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-xl backdrop-blur-md flex items-center justify-center gap-1 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }}
          className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors shadow-lg shadow-indigo-500/30"
        >
           Add Exp
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/settle/${group._id}`); }}
          className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors"
        >
           Settle
        </button>
      </div>
    </div>
  );
}
