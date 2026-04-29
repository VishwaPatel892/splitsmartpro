import { X, Users, ChevronRight } from 'lucide-react';

export default function SelectGroupModal({ groups, title, onClose, onSelect }) {
  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-white font-bold text-lg">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#334155] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {groups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#64748B] text-sm">No groups found. Create one first!</p>
            </div>
          ) : (
            groups.map((group) => (
              <button
                key={group._id}
                onClick={() => onSelect(group)}
                className="w-full p-4 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-indigo-500/50 hover:bg-[#1E293B]/60 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
                    {group.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm group-hover:text-indigo-400 transition-colors">{group.name}</h4>
                    <p className="text-[#64748B] text-xs">{group.members?.length || 0} members</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#334155] group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#334155] bg-[#0F172A]/50">
          <p className="text-[#475569] text-[10px] text-center uppercase tracking-widest font-bold">Select a group to proceed</p>
        </div>
      </div>
    </div>
  );
}
