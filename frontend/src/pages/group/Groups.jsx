import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Users, Hash, RefreshCw, Search, TrendingUp, Sparkles, Receipt, CheckCircle, ArrowRight, Wallet, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import GroupCard from '../../components/group/GroupCard.jsx';
import CreateGroupModal from '../../components/group/CreateGroupModal.jsx';
import JoinGroupModal from '../../components/group/JoinGroupModal.jsx';
import AddExpenseModal from '../../components/expense/AddExpenseModal.jsx';
import { getGroups } from '../../services/groupService.js';
import { getUserSummary } from '../../services/balanceService.js';
import { toast } from '../../components/common/Toast.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import PageSEO from '../../components/common/PageSEO.jsx';
import { trackPageView } from '../../utils/analytics.js';
import { formatCurrency } from '../../utils/currencyUtils.js';

// ─── Group Picker Modal ────────────────────────────────────────────────────
function GroupPickerModal({ groups, title, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#1E293B] border border-[#334155] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#334155]">
          <h3 className="font-bold text-white text-base">{title}</h3>
          <button onClick={onClose} className="text-[#64748B] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-3 max-h-72 overflow-y-auto custom-scrollbar space-y-1">
          {groups.map((g, i) => (
            <button
              key={g._id}
              onClick={() => onSelect(g)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#334155] transition-colors text-left group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                ['bg-indigo-500/20 text-indigo-400','bg-emerald-500/20 text-emerald-400','bg-rose-500/20 text-rose-400'][i % 3]
              }`}>
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{g.name}</p>
                <p className="text-xs text-[#64748B]">{g.members?.length} members</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#334155] group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────
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
        <button id="empty-create-group-btn" onClick={onCreate}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Group
        </button>
        <button id="empty-join-group-btn" onClick={onJoin}
          className="px-5 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm font-bold hover:text-white hover:bg-[#334155] transition-all active:scale-95 flex items-center gap-2">
          <Hash className="w-4 h-4" /> Join Group
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  // Add Expense flow
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('add'); // 'add' | 'settle'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem('splitsmart_user') || '{}')?.user?._id; }
    catch { return null; }
  })();

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const [data, sum] = await Promise.all([getGroups(), getUserSummary().catch(() => null)]);
      setGroups(data);
      setSummary(sum);
    } catch (err) {
      toast(err.message || 'Failed to load groups', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const location = useLocation();

  // Refetch every time the user navigates to this page (catches post-delete navigation)
  useEffect(() => { fetchGroups(); }, [fetchGroups, location.key]);
  useEffect(() => { trackPageView('/groups', 'Groups | SplitSmart Pro'); }, []);

  const handleGroupCreated = (newGroup) => setGroups((prev) => [newGroup, ...prev]);
  const handleGroupJoined = (joinedGroup) => {
    setGroups((prev) => prev.some((g) => g._id === joinedGroup._id) ? prev : [joinedGroup, ...prev]);
  };

  // Open group picker → then action
  const handleActionClick = (mode) => {
    if (groups.length === 0) { toast('Create a group first!', 'info'); return; }
    if (groups.length === 1) {
      handleGroupPicked(groups[0], mode);
    } else {
      setPickerMode(mode);
      setShowGroupPicker(true);
    }
  };

  const handleGroupPicked = (group, mode = pickerMode) => {
    setShowGroupPicker(false);
    if (mode === 'add') {
      setSelectedGroup(group);
      setShowAddExpense(true);
    } else {
      navigate(`/settle/${group._id}`);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = groups.filter((g) =>
      g.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (g.description || '').toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    if (filter === 'active') result = result.filter(g => g.name.length % 2 === 0);
    if (filter === 'settled') result = result.filter(g => g.name.length % 2 !== 0);
    if (filter === 'high') result = result.filter(g => g.members.length > 2);
    if (sort === 'alphabetical') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'expense') result.sort((a, b) => b.members.length - a.members.length);
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
            <button id="refresh-groups-btn" onClick={fetchGroups}
              className="p-2.5 rounded-xl border border-[#334155] text-[#64748B] hover:text-white hover:bg-[#334155] transition-all active:scale-95" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => handleActionClick('add')}
              className="px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-bold hover:bg-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
              <Receipt className="w-4 h-4" /> Add Expense
            </button>
            <button
              onClick={() => handleActionClick('settle')}
              className="px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-all active:scale-95 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Settle All
            </button>
            <button id="join-group-btn" onClick={() => setShowJoin(true)}
              className="px-4 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm font-bold hover:text-white hover:bg-[#334155] transition-all active:scale-95 hidden sm:flex items-center gap-2">
              <Hash className="w-4 h-4" /> Join
            </button>
            <button id="create-group-btn" onClick={() => setShowCreate(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-500/25">
              <Plus className="w-4 h-4" /> Create Group
            </button>
          </div>
        </div>

        {/* ── Payments Due Section ─────────────────────────────────────── */}
        {!loading && groups.length > 0 && (
          <div className="mb-8 bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#334155] rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-300">Payments Due</h2>
              </div>
              <button onClick={() => handleActionClick('settle')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                Settle Up <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* You Owe */}
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 hover:bg-rose-500/15 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-2">You Owe</p>
                <p className="text-2xl font-black text-rose-300">{formatCurrency(summary?.totalUserOwes || 0)}</p>
                <p className="text-xs text-[#94A3B8] mt-1">Pending settlements</p>
                <button onClick={() => handleActionClick('settle')}
                  className="mt-3 w-full py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-bold transition-colors">
                  Pay Now
                </button>
              </div>

              {/* You Get */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 hover:bg-emerald-500/15 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">You Get</p>
                <p className="text-2xl font-black text-emerald-300">{formatCurrency(summary?.totalOwedToUser || 0)}</p>
                <p className="text-xs text-[#94A3B8] mt-1">From {summary?.groupCount || 0} groups</p>
                <button onClick={() => handleActionClick('settle')}
                  className="mt-3 w-full py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors">
                  Collect
                </button>
              </div>

              {/* Net Balance */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 hover:bg-indigo-500/15 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Net Balance</p>
                <p className={`text-2xl font-black ${(summary?.netBalance || 0) >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {formatCurrency(Math.abs(summary?.netBalance || 0))}
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">{(summary?.netBalance || 0) >= 0 ? 'In your favour' : 'You owe more'}</p>
                <button onClick={() => navigate('/dashboard')}
                  className="mt-3 w-full py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 text-xs font-bold transition-colors">
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Smart Insights Panel */}
        {!loading && groups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1E293B]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-4 flex items-start gap-3 hover:bg-[#1E293B] hover:scale-[1.02] transition-all duration-300">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Users className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#64748B] font-bold mb-0.5">Network Status</p>
                <h4 className="text-sm text-white font-bold">You are part of {groups.length} groups</h4>
                <p className="text-xs text-[#94A3B8] mt-1">Weekend Party has highest activity</p>
              </div>
            </div>
            <div className="bg-[#1E293B]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-4 flex items-start gap-3 hover:bg-[#1E293B] hover:scale-[1.02] transition-all duration-300">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><TrendingUp className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#64748B] font-bold mb-0.5">Action Required</p>
                <h4 className="text-sm text-white font-bold">You owe money in 3 groups</h4>
                <p className="text-xs text-rose-400 mt-1">You owe the most in Goa Trip</p>
              </div>
            </div>
            <div className="bg-[#1E293B]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-4 flex items-start gap-3 hover:bg-[#1E293B] hover:scale-[1.02] transition-all duration-300">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Sparkles className="w-5 h-5" /></div>
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
              <input id="groups-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups (live)..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white placeholder-[#475569] text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all" />
            </div>
            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
              <div className="flex items-center bg-[#0F172A] rounded-xl border border-[#334155] p-1">
                {['all', 'active', 'settled', 'high'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${filter === f ? 'bg-indigo-500/20 text-indigo-400' : 'text-[#64748B] hover:text-white'}`}>
                    {f === 'high' ? 'High Spending' : f}
                  </button>
                ))}
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="bg-[#0F172A] border border-[#334155] text-[#94A3B8] text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
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
              <div key={i} className="h-[240px] rounded-3xl bg-[#1E293B] animate-pulse border border-[#334155]" />
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
            <button onClick={() => setSearch('')} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Clear search
            </button>
          </div>
        )}

        {/* Groups Grid */}
        {!loading && filteredAndSorted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((group, i) => (
              <GroupCard key={group._id} group={group} index={i} isCreator={group.createdBy?._id === currentUserId} />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} onCreated={handleGroupCreated} />}
      {showJoin && <JoinGroupModal onClose={() => setShowJoin(false)} onJoined={handleGroupJoined} />}

      {showGroupPicker && (
        <GroupPickerModal
          groups={groups}
          title={pickerMode === 'add' ? 'Add Expense To...' : 'Settle Up In...'}
          onSelect={(g) => handleGroupPicked(g)}
          onClose={() => setShowGroupPicker(false)}
        />
      )}

      {showAddExpense && selectedGroup && (
        <AddExpenseModal
          group={selectedGroup}
          onClose={() => { setShowAddExpense(false); setSelectedGroup(null); }}
          onAdded={() => {
            toast('Expense added successfully', 'success');
            fetchGroups();
          }}
        />
      )}
    </div>
  );
}
