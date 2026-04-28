import { Users, ArrowRight, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      className={`relative rounded-2xl border bg-gradient-to-br ${gradient} p-5 flex flex-col gap-4
        hover:scale-[1.02] hover:shadow-xl transition-all duration-200 group cursor-pointer active:scale-[0.98]`}
      onClick={() => navigate(`/groups/${group._id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className={`p-2.5 rounded-xl ${iconColor}`}>
          <Users className="w-5 h-5" />
        </div>
        {isCreator && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Crown className="w-2.5 h-2.5" /> Creator
          </span>
        )}
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white text-base leading-tight truncate">
          {group.name}
        </h3>
        {group.description && (
          <p className="text-[#94A3B8] text-xs mt-1 leading-relaxed line-clamp-2">
            {group.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Member avatars */}
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

        <span className="text-xs text-[#64748B] font-medium">
          {group.members.length} member{group.members.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Hover arrow */}
      <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-200" />
    </div>
  );
}
