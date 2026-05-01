import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, ArrowRight, ChevronRight, Filter } from 'lucide-react';
import { getGroups } from '../../services/groupService';

const GRADIENT_COLORS = [
  'from-indigo-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-cyan-600',
];

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('active'); // active, settled

  const navigate = useNavigate();

  useEffect(() => {
    getGroups()
      .then((data) => setGroups(data.slice(0, 4)))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-[#F8FAFC]">Active Groups</h3>
        <button
          onClick={() => navigate('/groups')}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mb-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <button 
            onClick={() => setFilter('active')}
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-colors ${filter === 'active' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-[#0F172A] text-[#64748B] border border-[#334155] hover:text-white'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('settled')}
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-colors ${filter === 'settled' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-[#0F172A] text-[#64748B] border border-[#334155] hover:text-white'}`}
          >
            Settled
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[#0F172A] rounded-xl animate-pulse border border-[#334155]" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && groups.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#0F172A] border border-[#334155] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#334155]" />
          </div>
          <p className="text-sm text-[#475569]">No groups yet</p>
          <button
            onClick={() => navigate('/groups')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Create one →
          </button>
        </div>
      )}

      {/* Group items */}
      {!loading && groups.length > 0 && (
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
          {groups
            .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(g => filter === 'active' ? true : false) // Mocking settled as having 0 for now since we don't have settled groups
            .map((group, idx) => {
            const color = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];
            return (
              <div
                key={group._id}
                onClick={() => navigate(`/groups/${group._id}`)}
                className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-indigo-500/50 hover:bg-[#1E293B]/60 transition-all cursor-pointer group active:scale-[0.98] flex items-center gap-3"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 group-hover:rotate-2 transition-transform`}>
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#F8FAFC] text-sm truncate group-hover:text-indigo-300 transition-colors">
                    {group.name}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">{group.members?.length} member{group.members?.length !== 1 ? 's' : ''}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#334155] group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
