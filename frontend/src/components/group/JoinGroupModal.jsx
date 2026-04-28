import { useState } from 'react';
import { X, Hash, Loader2 } from 'lucide-react';
import { joinGroup } from '../../services/groupService.js';
import { toast } from '../common/Toast.jsx';

export default function JoinGroupModal({ onClose, onJoined }) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = inviteCode.trim();
    if (!code) return;

    setLoading(true);
    try {
      const group = await joinGroup(code);
      toast(`Joined "${group.name}" successfully!`, 'success');
      onJoined(group);
      onClose();
    } catch (err) {
      toast(err.message || 'Failed to join group', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Hash className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Join Group</h2>
              <p className="text-[#64748B] text-xs">Enter an invite code to join</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#334155] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">
              Invite Code
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
              <input
                id="join-group-code"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.trim())}
                placeholder="e.g. aB3xYz1q9T"
                maxLength={20}
                required
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white placeholder-[#475569] text-sm font-mono tracking-widest
                  focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <p className="text-[#475569] text-xs mt-2">
              Ask your group creator to share the invite code.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm font-semibold hover:bg-[#334155] hover:text-white transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              id="join-group-submit"
              type="submit"
              disabled={loading || !inviteCode.trim()}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-all active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Joining...</>
              ) : (
                'Join Group'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
