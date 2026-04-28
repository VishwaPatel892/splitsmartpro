import { useEffect, useState, useCallback } from 'react';
import { Plus, Users, Hash, RefreshCw, Search } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import GroupCard from '../../components/group/GroupCard.jsx';
import CreateGroupModal from '../../components/group/CreateGroupModal.jsx';
import JoinGroupModal from '../../components/group/JoinGroupModal.jsx';
import { getGroups } from '../../services/groupService.js';
import { toast } from '../../components/common/Toast.jsx';

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

  const handleGroupCreated = (newGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
  };

  const handleGroupJoined = (joinedGroup) => {
    setGroups((prev) => {
      const exists = prev.some((g) => g._id === joinedGroup._id);
      return exists ? prev : [joinedGroup, ...prev];
    });
  };

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-16">
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

          <div className="flex gap-2 shrink-0">
            <button
              id="refresh-groups-btn"
              onClick={fetchGroups}
              className="p-2.5 rounded-xl border border-[#334155] text-[#64748B] hover:text-white hover:bg-[#334155] transition-all active:scale-95"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="join-group-btn"
              onClick={() => setShowJoin(true)}
              className="px-4 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm font-bold hover:text-white hover:bg-[#334155] transition-all active:scale-95 flex items-center gap-2"
            >
              <Hash className="w-4 h-4" /> Join
            </button>
            <button
              id="create-group-btn"
              onClick={() => setShowCreate(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
        </div>

        {/* Search */}
        {groups.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
            <input
              id="groups-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groups..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white placeholder-[#475569] text-sm
                focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
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
        {!loading && groups.length > 0 && filtered.length === 0 && (
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
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((group, i) => (
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
