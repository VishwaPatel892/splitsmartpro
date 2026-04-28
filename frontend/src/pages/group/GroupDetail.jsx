import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, Copy, Check, Trash2, Plus,
  Crown, Loader2, AlertTriangle, Receipt, TrendingUp,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import ExpenseCard from '../../components/expense/ExpenseCard.jsx';
import AddExpenseModal from '../../components/expense/AddExpenseModal.jsx';
import { getGroupById, deleteGroup } from '../../services/groupService.js';
import { getExpensesByGroup } from '../../services/expenseService.js';
import { toast } from '../../components/common/Toast.jsx';

function MemberRow({ member, isCreator }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#0F172A] last:border-0">
      <div className="w-9 h-9 rounded-full bg-[#334155] flex items-center justify-center text-sm font-bold text-white uppercase shrink-0">
        {(member.name || '?')[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{member.name}</p>
        <p className="text-xs text-[#64748B] truncate">{member.email}</p>
      </div>
      {isCreator && (
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
          <Crown className="w-2.5 h-2.5" /> Creator
        </span>
      )}
    </div>
  );
}

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')._id;
    } catch { return null; }
  })();

  const fetchGroup = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getGroupById(id);
      setGroup(data);
    } catch (err) {
      setError(err.message || 'Failed to load group');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchExpenses = useCallback(async () => {
    setExpensesLoading(true);
    try {
      const data = await getExpensesByGroup(id);
      setExpenses(data);
    } catch (err) {
      toast(err.message || 'Failed to load expenses', 'error');
    } finally {
      setExpensesLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchGroup(); }, [fetchGroup]);
  useEffect(() => { if (group) fetchExpenses(); }, [group, fetchExpenses]);

  const handleCopyCode = async () => {
    if (!group?.inviteCode) return;
    await navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    toast('Invite code copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteGroup(id);
      toast('Group deleted', 'info');
      navigate('/groups');
    } catch (err) {
      toast(err.message || 'Failed to delete group', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleExpenseAdded = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const handleExpenseDeleted = (expenseId) => {
    setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
  };

  const isCreator = group?.createdBy?._id === currentUserId;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 pt-28 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-[#1E293B] rounded-2xl animate-pulse" />
          ))}
        </main>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white font-sans flex flex-col">
        <Navbar />
        <main className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
          <AlertTriangle className="w-12 h-12 text-rose-400" />
          <p className="text-rose-300 text-lg font-semibold">{error}</p>
          <button onClick={() => navigate('/groups')} className="px-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-sm font-semibold hover:bg-[#334155] transition-all">
            Back to Groups
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-16">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-24">
        {/* Back */}
        <button onClick={() => navigate('/groups')} className="flex items-center gap-2 text-[#64748B] hover:text-white text-sm font-medium mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Groups
        </button>

        {/* Group Header */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <Users className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{group.name}</h1>
                {group.description && <p className="text-[#94A3B8] text-sm mt-1">{group.description}</p>}
                <p className="text-[#64748B] text-xs mt-1.5">
                  Created by <span className="text-[#94A3B8] font-medium">{group.createdBy?.name}</span>
                  &nbsp;· {new Date(group.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            {isCreator && (
              <button id="delete-group-btn" onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95" title="Delete group">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl bg-[#1E293B] border border-[#334155] p-4 text-center">
            <p className="text-2xl font-bold text-white">{group.members.length}</p>
            <p className="text-[10px] text-[#64748B] mt-1 font-medium uppercase tracking-wider">Members</p>
          </div>
          <div className="rounded-xl bg-[#1E293B] border border-[#334155] p-4 text-center">
            <p className="text-2xl font-bold text-white">{expenses.length}</p>
            <p className="text-[10px] text-[#64748B] mt-1 font-medium uppercase tracking-wider">Expenses</p>
          </div>
          <div className="rounded-xl bg-[#1E293B] border border-[#334155] p-4 text-center">
            <p className="text-2xl font-bold text-indigo-400">₹{totalExpenses.toFixed(0)}</p>
            <p className="text-[10px] text-[#64748B] mt-1 font-medium uppercase tracking-wider">Total Spent</p>
          </div>
        </div>

        {/* Invite Code */}
        <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-5 mb-6">
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3">Invite Code</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-2.5 text-indigo-300 font-mono text-sm tracking-[0.2em] select-all">
              {group.inviteCode}
            </code>
            <button id="copy-invite-code" onClick={handleCopyCode}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 ${copied ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-[#334155] text-[#64748B] hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10'}`}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[#475569] text-xs mt-2">Share this code to invite others.</p>
        </div>

        {/* Expenses Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Expenses</h2>
              {expenses.length > 0 && (
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  {expenses.length}
                </span>
              )}
            </div>
            <button
              id="add-expense-btn"
              onClick={() => setShowAddExpense(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> Add Expense
            </button>
          </div>

          {expensesLoading ? (
            <div className="space-y-2">
              {[1,2].map(i => <div key={i} className="h-16 rounded-xl bg-[#1E293B] animate-pulse" />)}
            </div>
          ) : expenses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#334155] p-10 text-center">
              <TrendingUp className="w-8 h-8 text-[#334155] mx-auto mb-3" />
              <p className="text-[#64748B] text-sm font-medium">No expenses yet</p>
              <p className="text-[#475569] text-xs mt-1">Add the first expense for this group.</p>
              <button
                onClick={() => setShowAddExpense(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all active:scale-95"
              >
                + Add Expense
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  currentUserId={currentUserId}
                  isCreator={isCreator}
                  onDeleted={handleExpenseDeleted}
                />
              ))}
            </div>
          )}
        </div>

        {/* Members */}
        <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest">Members</p>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">{group.members.length}</span>
          </div>
          <div>
            {group.members.map((m) => (
              <MemberRow key={m._id} member={m} isCreator={m._id === group.createdBy?._id} />
            ))}
          </div>
        </div>
      </main>

      {/* Add Expense Modal */}
      {showAddExpense && group && (
        <AddExpenseModal
          group={group}
          onClose={() => setShowAddExpense(false)}
          onAdded={handleExpenseAdded}
        />
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteConfirm(false)}>
          <div className="w-full max-w-sm bg-[#1E293B] border border-rose-500/30 rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="font-bold text-white">Delete Group?</h3>
            </div>
            <p className="text-[#94A3B8] text-sm mb-6">
              This will permanently delete <span className="text-white font-semibold">"{group.name}"</span> and all its expenses.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm font-semibold hover:bg-[#334155] transition-all">Cancel</button>
              <button id="confirm-delete-btn" onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-500 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60">
                {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
