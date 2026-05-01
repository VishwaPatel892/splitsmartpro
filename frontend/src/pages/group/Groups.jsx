import { useEffect, useState, useCallback, useMemo } from 'react';
import { Plus, Users, Hash, RefreshCw, Search, Filter, TrendingUp, Sparkles, Receipt, CheckCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import GroupCard from '../../components/group/GroupCard.jsx';
import CreateGroupModal from '../../components/group/CreateGroupModal.jsx';
import JoinGroupModal from '../../components/group/JoinGroupModal.jsx';
import { getGroups } from '../../services/groupService.js';
import { toast } from '../../components/common/Toast.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import PageSEO from '../../components/common/PageSEO.jsx';
import { trackPageView } from '../../utils/analytics.js';

function EmptyState({ onCreate, onJoin }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Users className="w-10 h-10 text-indigo-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1E293B] border-2 border-[#0F172A] flex items-center justify-center">
          <Plus className="w-3 h-3 text-indigo-400" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-1">No groups yet</h2>
        <p className="text-[#64748B] text-sm max-w-xs">
          Create a group to start tracking shared expenses, or join one with an invite code.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          id="empty-create-group-btn"
          onClick={onCreate}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Group
        </button>
        <button
          id="empty-join-group-btn"
          onClick={onJoin}
          className="px-5 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm font-bold hover:text-white hover:bg-[#334155] transition-all active:scale-95 flex items-center gap-2"
        >
          <Hash className="w-4 h-4" /> Join Group
        </button>
      </div>
    </div>
  );
}

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, settled, high
  const [sort, setSort] = useState('recent'); // recent, expense, alphabetical
  const debouncedSearch = useDebounce(search, 350);

  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem('splitsmart_user') || '{}')?.user?._id;
    } catch {
      return null;
    }
  })();

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      toast(err.message || 'Failed to load groups', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  useEffect(() => { trackPageView('/groups', 'Groups | SplitSmart Pro'); }, []);

  const handleGroupCreated = (newGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
  };

  const handleGroupJoined = (joinedGroup) => {
    setGroups((prev) => {
      const exists = prev.some((g) => g._id === joinedGroup._id);
      return exists ? prev : [joinedGroup, ...prev];
    });
  };

  const filteredAndSorted = useMemo(() => {
    let result = groups.filter((g) =>
      g.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (g.description || '').toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    // Mock filtering logic for demo
    if (filter === 'active') result = result.filter(g => g.name.length % 2 === 0);
    if (filter === 'settled') result = result.filter(g => g.name.length % 2 !== 0);
    if (filter === 'high') result = result.filter(g => g.members.length > 2);

    // Mock sorting logic for demo
    if (sort === 'alphabetical') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'expense') {
      result.sort((a, b) => b.members.length - a.members.length);
    } else {
      // recent
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [groups, debouncedSearch, filter, sort]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-16">
      <PageSEO title="Groups" description="Create and manage your expense groups for trips, roommates, and teams." path="/groups" />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-24">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Groups</h1>
            <p className="text-[#94A3B8] text-sm mt-1">
              {groups.length > 0 ? `You're in ${groups.length} group${groups.length !== 1 ? 's' : ''}` : 'Manage your shared expense groups'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              id="refresh-groups-btn"
              onClick={fetchGroups}
              className="p-2.5 rounded-xl border border-[#334155] text-[#64748B] hover:text-white hover:bg-[#334155] transition-all active:scale-95"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => { toast('Added a new expense', 'success'); }}
              className="px-4 py-2.5 rounded-xl border border-[#334155] bg-[#1E293B] text-white text-sm font-bold hover:bg-[#334155] transition-all active:scale-95 flex items-center gap-2"
            >
              <Receipt className="w-4 h-4 text-indigo-400" /> Add Expense
            </button>
            <button
              onClick={() => { toast('All balances settled', 'success'); }}
              className="px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Settle All
            </button>
            <button
              id="join-group-btn"
              onClick={() => setShowJoin(true)}
              className="px-4 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm font-bold hover:text-white hover:bg-[#334155] transition-all active:scale-95 flex items-center gap-2 hidden sm:flex"
            >
              <Hash className="w-4 h-4" /> Join
            </button>
            <button
              id="create-group-btn"
              onClick={() => setShowCreate(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <Plus className="w-4 h-4" /> Create Group
            </button>
          </div>
        </div>

        {/* Smart Insights Panel (FAANG Feature) */}
        {!loading && groups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1E293B]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-4 flex items-start gap-3 hover:bg-[#1E293B] hover:scale-[1.02] transition-all duration-300">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#64748B] font-bold mb-0.5">Network Status</p>
                <h4 className="text-sm text-white font-bold">You are part of {groups.length} groups</h4>
                <p className="text-xs text-[#94A3B8] mt-1">Weekend Party has highest activity</p>
              </div>
            </div>
            
            <div className="bg-[#1E293B]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-4 flex items-start gap-3 hover:bg-[#1E293B] hover:scale-[1.02] transition-all duration-300">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#64748B] font-bold mb-0.5">Action Required</p>
                <h4 className="text-sm text-white font-bold">You owe money in 3 groups</h4>
                <p className="text-xs text-rose-400 mt-1">You owe the most in Goa Trip</p>
              </div>
            </div>
            
            <div className="bg-[#1E293B]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-4 flex items-start gap-3 hover:bg-[#1E293B] hover:scale-[1.02] transition-all duration-300">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#64748B] font-bold mb-0.5">Top Insight</p>
                <h4 className="text-sm text-white font-bold">Highest spending group</h4>
                <p className="text-xs text-emerald-400 mt-1">Roommates (₹15,000 this month)</p>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Search & Filter */}
        {groups.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-6 bg-[#1E293B]/40 p-4 rounded-2xl border border-[#334155]">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
              <input
                id="groups-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups (live)..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white placeholder-[#475569] text-sm
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
              <div className="flex items-center bg-[#0F172A] rounded-xl border border-[#334155] p-1">
                {['all', 'active', 'settled', 'high'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${filter === f ? 'bg-indigo-500/20 text-indigo-400' : 'text-[#64748B] hover:text-white'}`}
                  >
                    {f === 'high' ? 'High Spending' : f}
                  </button>
                ))}
              </div>
              
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-[#0F172A] border border-[#334155] text-[#94A3B8] text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer outline-none"
              >
                <option value="recent">Recently Active</option>
                <option value="expense">Highest Expense</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
        )}

        {/* Skeleton Loader */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-[#1E293B] animate-pulse border border-[#334155]" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && groups.length === 0 && (
          <EmptyState onCreate={() => setShowCreate(true)} onJoin={() => setShowJoin(true)} />
        )}

        {/* No search results */}
        {!loading && groups.length > 0 && filteredAndSorted.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#64748B] text-sm">No groups match "<span className="text-white">{search}</span>"</p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Groups Grid */}
        {!loading && filteredAndSorted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((group, i) => (
              <GroupCard
                key={group._id}
                group={group}
                index={i}
                isCreator={group.createdBy?._id === currentUserId}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreated={handleGroupCreated}
        />
      )}
      {showJoin && (
        <JoinGroupModal
          onClose={() => setShowJoin(false)}
          onJoined={handleGroupJoined}
        />
      )}
    </div>
  );
}
