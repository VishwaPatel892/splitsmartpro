import { useState } from 'react';
import { X, Users, FileText, Loader2 } from 'lucide-react';
import { createGroup } from '../../services/groupService.js';
import { toast } from '../common/Toast.jsx';

export default function CreateGroupModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const group = await createGroup({ name: name.trim(), description: description.trim() });
      toast('Group created successfully!', 'success');
      onCreated(group);
      onClose();
    } catch (err) {
      toast(err.message || 'Failed to create group', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Create Group</h2>
              <p className="text-[#64748B] text-xs">Start splitting expenses together</p>
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
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">
              Group Name *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
              <input
                id="create-group-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Goa Trip, Flat Mates..."
                maxLength={50}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white placeholder-[#475569] text-sm
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">
              Description <span className="text-[#475569] normal-case font-normal">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-[#475569]" />
              <textarea
                id="create-group-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this group for?"
                maxLength={200}
                rows={3}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white placeholder-[#475569] text-sm resize-none
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <p className="text-right text-[10px] text-[#475569] mt-1">{description.length}/200</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm font-semibold hover:bg-[#334155] hover:text-white transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              id="create-group-submit"
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
              ) : (
                'Create Group'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
