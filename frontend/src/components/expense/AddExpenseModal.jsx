import { useState, useEffect } from 'react';
import { X, Receipt, DollarSign, User, Loader2, ChevronDown } from 'lucide-react';
import { createExpense } from '../../services/expenseService.js';
import { toast } from '../common/Toast.jsx';
import { equalSplit, customSplit, percentageSplit } from '../../utils/splitLogic.js';

const SPLIT_TYPES = [
  { value: 'equal', label: 'Equal', desc: 'Divide equally among all members' },
  { value: 'custom', label: 'Custom', desc: 'Enter exact amounts per person' },
  { value: 'percentage', label: 'Percentage', desc: 'Split by percentage' },
];

export default function AddExpenseModal({ group, onClose, onAdded }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(group.members[0]?._id || '');
  const [splitType, setSplitType] = useState('equal');
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const members = group.members;
  const totalAmount = parseFloat(amount) || 0;

  // Re-initialise splits whenever amount or splitType changes
  useEffect(() => {
    if (!totalAmount || !members.length) return;
    if (splitType === 'equal') {
      setSplits(members.map((m) => ({ user: m._id, name: m.name, amount: 0 })));
    } else if (splitType === 'custom') {
      setSplits(members.map((m) => ({ user: m._id, name: m.name, amount: '' })));
    } else {
      setSplits(members.map((m) => ({ user: m._id, name: m.name, percentage: '' })));
    }
  }, [splitType, members.length]);

  // Live-compute equal splits preview
  const equalPreview = (() => {
    if (splitType !== 'equal' || !totalAmount) return [];
    try { return equalSplit(totalAmount, members.map((m) => m._id)); } catch { return []; }
  })();

  const updateSplitField = (idx, field, val) => {
    setSplits((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!amount || totalAmount <= 0) errs.amount = 'Valid amount is required';
    if (!paidBy) errs.paidBy = 'Select who paid';
    if (splitType === 'custom') {
      const sum = splits.reduce((a, s) => a + (parseFloat(s.amount) || 0), 0);
      if (Math.abs(sum - totalAmount) > 0.01)
        errs.splits = `Amounts must sum to ₹${totalAmount.toFixed(2)} (current: ₹${sum.toFixed(2)})`;
    }
    if (splitType === 'percentage') {
      const sum = splits.reduce((a, s) => a + (parseFloat(s.percentage) || 0), 0);
      if (Math.abs(sum - 100) > 0.01)
        errs.splits = `Percentages must sum to 100% (current: ${sum.toFixed(1)}%)`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      let payload = { groupId: group._id, title: title.trim(), amount: totalAmount, paidBy, splitType };
      if (splitType === 'custom') payload.splits = splits.map((s) => ({ user: s.user, amount: parseFloat(s.amount) }));
      if (splitType === 'percentage') payload.splits = splits.map((s) => ({ user: s.user, percentage: parseFloat(s.percentage) }));
      const expense = await createExpense(payload);
      toast('Expense added!', 'success');
      onAdded(expense);
      onClose();
    } catch (err) {
      toast(err.message || 'Failed to add expense', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Sums for live feedback
  const customSum = splitType === 'custom' ? splits.reduce((a, s) => a + (parseFloat(s.amount) || 0), 0) : 0;
  const pctSum = splitType === 'percentage' ? splits.reduce((a, s) => a + (parseFloat(s.percentage) || 0), 0) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#334155] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Receipt className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Add Expense</h2>
              <p className="text-[#64748B] text-xs">{group.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#334155] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Title *</label>
            <div className="relative">
              <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
              <input
                id="expense-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dinner, Hotel, Taxi..."
                maxLength={80}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F172A] border text-white placeholder-[#475569] text-sm focus:outline-none transition-all
                  ${errors.title ? 'border-rose-500 focus:ring-1 focus:ring-rose-500/50' : 'border-[#334155] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'}`}
              />
            </div>
            {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Amount (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] text-sm font-bold">₹</span>
              <input
                id="expense-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#0F172A] border text-white placeholder-[#475569] text-sm focus:outline-none transition-all
                  ${errors.amount ? 'border-rose-500 focus:ring-1 focus:ring-rose-500/50' : 'border-[#334155] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'}`}
              />
            </div>
            {errors.amount && <p className="text-rose-400 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Paid By *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
              <select
                id="expense-paid-by"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
              >
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
            </div>
          </div>

          {/* Split Type */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Split Type</label>
            <div className="grid grid-cols-3 gap-2">
              {SPLIT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSplitType(t.value)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-center
                    ${splitType === t.value
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'border-[#334155] text-[#94A3B8] hover:border-indigo-500/50 hover:text-white bg-[#0F172A]'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="text-[#475569] text-xs mt-1.5">{SPLIT_TYPES.find((t) => t.value === splitType)?.desc}</p>
          </div>

          {/* Split Details */}
          {totalAmount > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Split Details</label>
                {splitType === 'custom' && (
                  <span className={`text-xs font-bold ${Math.abs(customSum - totalAmount) < 0.01 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    ₹{customSum.toFixed(2)} / ₹{totalAmount.toFixed(2)}
                  </span>
                )}
                {splitType === 'percentage' && (
                  <span className={`text-xs font-bold ${Math.abs(pctSum - 100) < 0.01 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {pctSum.toFixed(1)}% / 100%
                  </span>
                )}
              </div>

              <div className="space-y-2 rounded-xl bg-[#0F172A] border border-[#334155] p-3">
                {splitType === 'equal' && equalPreview.map((s) => {
                  const member = members.find((m) => m._id === s.user);
                  return (
                    <div key={s.user} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#334155] flex items-center justify-center text-[10px] font-bold text-white uppercase">{(member?.name || '?')[0]}</div>
                        <span className="text-sm text-[#94A3B8]">{member?.name}</span>
                      </div>
                      <span className="text-sm font-bold text-white">₹{s.amount.toFixed(2)}</span>
                    </div>
                  );
                })}

                {splitType === 'custom' && splits.map((s, i) => (
                  <div key={s.user} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#334155] flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">{(s.name || '?')[0]}</div>
                    <span className="text-sm text-[#94A3B8] flex-1 truncate">{s.name}</span>
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#475569] text-xs">₹</span>
                      <input
                        type="number" min="0" step="0.01"
                        value={s.amount}
                        onChange={(e) => updateSplitField(i, 'amount', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-white text-xs focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                ))}

                {splitType === 'percentage' && splits.map((s, i) => (
                  <div key={s.user} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#334155] flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">{(s.name || '?')[0]}</div>
                    <span className="text-sm text-[#94A3B8] flex-1 truncate">{s.name}</span>
                    <div className="relative w-24">
                      <input
                        type="number" min="0" max="100" step="0.1"
                        value={s.percentage}
                        onChange={(e) => updateSplitField(i, 'percentage', e.target.value)}
                        placeholder="0"
                        className="w-full pl-2 pr-6 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-white text-xs focus:outline-none focus:border-indigo-500 transition-all"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#475569] text-xs">%</span>
                    </div>
                    {s.percentage && totalAmount ? (
                      <span className="text-xs text-[#64748B] w-16 text-right">≈ ₹{((parseFloat(s.percentage) / 100) * totalAmount).toFixed(2)}</span>
                    ) : null}
                  </div>
                ))}
              </div>
              {errors.splits && <p className="text-rose-400 text-xs mt-1">{errors.splits}</p>}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#334155] flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm font-semibold hover:bg-[#334155] hover:text-white transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            id="add-expense-submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
