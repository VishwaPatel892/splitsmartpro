import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Receipt } from 'lucide-react';
import { deleteExpense } from '../../services/expenseService.js';
import { toast } from '../common/Toast.jsx';

const SPLIT_BADGE = {
  equal:      { label: 'Equal',      color: 'text-indigo-400  bg-indigo-500/10  border-indigo-500/20'  },
  custom:     { label: 'Custom',     color: 'text-amber-400   bg-amber-500/10   border-amber-500/20'   },
  percentage: { label: '%',          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
};

export default function ExpenseCard({ expense, onDeleted, currentUserId, isCreator }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const badge = SPLIT_BADGE[expense.splitType] || SPLIT_BADGE.equal;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${expense.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteExpense(expense._id);
      toast('Expense deleted', 'info');
      onDeleted(expense._id);
    } catch (err) {
      toast(err.message || 'Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const paidByName = expense.paidBy?.name || 'Unknown';
  const iCanDelete = isCreator || expense.paidBy?._id === currentUserId;

  return (
    <div className="rounded-xl bg-[#0F172A] border border-[#334155] overflow-hidden hover:border-[#475569] transition-all">
      {/* Main row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Icon */}
        <div className="p-2 rounded-xl bg-[#1E293B] shrink-0">
          <Receipt className="w-4 h-4 text-indigo-400" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white truncate">{expense.title}</p>
            <span className={`text-[10px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Paid by <span className="text-[#94A3B8] font-medium">{paidByName}</span>
            &nbsp;· {new Date(expense.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
        </div>

        {/* Amount */}
        <div className="text-right shrink-0">
          <p className="text-base font-bold text-white">₹{expense.amount.toFixed(2)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {iCanDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50"
              title="Delete expense"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {expanded
            ? <ChevronUp className="w-4 h-4 text-[#475569]" />
            : <ChevronDown className="w-4 h-4 text-[#475569]" />
          }
        </div>
      </div>

      {/* Expanded splits */}
      {expanded && expense.splits?.length > 0 && (
        <div className="border-t border-[#334155] px-4 py-3 space-y-2 bg-[#0A1628]">
          <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-2">Split breakdown</p>
          {expense.splits.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {(s.user?.name || '?')[0]}
                </div>
                <span className="text-xs text-[#94A3B8]">{s.user?.name || 'Unknown'}</span>
              </div>
              <span className="text-xs font-bold text-white">₹{s.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
