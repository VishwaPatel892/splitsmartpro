import { useState, useEffect } from 'react';
import { X, Receipt, DollarSign, User, Loader2, ChevronDown, Sparkles } from 'lucide-react';
import { createExpense } from '../../services/expenseService.js';
import { toast } from '../common/Toast.jsx';
import { equalSplit } from '../../utils/splitLogic.js';

const SPLIT_TYPES = [
  { value: 'equal', label: 'Equal', desc: 'Divide equally' },
  { value: 'custom', label: 'Custom', desc: 'Exact amounts' },
  { value: 'percentage', label: 'Percentage', desc: 'By percentage' },
];

const SMART_SUGGESTIONS = [
  { title: 'Dinner', amount: '', category: 'Food' },
  { title: 'Uber/Taxi', amount: '', category: 'Travel' },
  { title: 'Groceries', amount: '', category: 'Shopping' },
  { title: 'Movies', amount: '', category: 'Entertainment' },
];

export default function AddExpenseModal({ group, onClose, onAdded }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(group.members[0]?._id || '');
  const [splitType, setSplitType] = useState('equal');
  const [splits, setSplits] = useState([]);
  const [category, setCategory] = useState('Others');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const members = group.members;
  const totalAmount = parseFloat(amount) || 0;

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

  const equalPreview = (() => {
    if (splitType !== 'equal' || !totalAmount) return [];
    try { return equalSplit(totalAmount, members.map((m) => m._id)); } catch { return []; }
  })();

  const updateSplitField = (idx, field, val) => {
    setSplits((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  };

  const applySuggestion = (suggestion) => {
    setTitle(suggestion.title);
    setCategory(suggestion.category);
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Required';
    if (!amount || totalAmount <= 0) errs.amount = 'Required';
    if (!paidBy) errs.paidBy = 'Required';
    if (splitType === 'custom') {
      const sum = splits.reduce((a, s) => a + (parseFloat(s.amount) || 0), 0);
      if (Math.abs(sum - totalAmount) > 0.01) errs.splits = `Must sum to ₹${totalAmount.toFixed(2)}`;
    }
    if (splitType === 'percentage') {
      const sum = splits.reduce((a, s) => a + (parseFloat(s.percentage) || 0), 0);
      if (Math.abs(sum - 100) > 0.01) errs.splits = `Must sum to 100%`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      let payload = { groupId: group._id, title: title.trim(), amount: totalAmount, paidBy, splitType, category };
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

  const customSum = splitType === 'custom' ? splits.reduce((a, s) => a + (parseFloat(s.amount) || 0), 0) : 0;
  const pctSum = splitType === 'percentage' ? splits.reduce((a, s) => a + (parseFloat(s.percentage) || 0), 0) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden max-h-[90vh] flex flex-col scale-100 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#334155] bg-[#0F172A]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30">
              <Receipt className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Quick Add Expense</h2>
              <p className="text-[#64748B] text-xs font-medium">{group.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-[#64748B] hover:text-white hover:bg-[#334155] transition-all active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto custom-scrollbar flex-1 px-6 py-6 space-y-6">

          {/* Smart Suggestions */}
          {!title && (
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              {SMART_SUGGESTIONS.map(sug => (
                <button
                  key={sug.title}
                  type="button"
                  onClick={() => applySuggestion(sug)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-xs font-semibold text-[#94A3B8] hover:text-indigo-400 hover:border-indigo-500/50 transition-all"
                >
                  {sug.title}
                </button>
              ))}
            </div>
          )}

          {/* Core Inputs (Title & Amount side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] mb-1.5 uppercase tracking-widest">What was it for?</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dinner"
                className={`w-full px-4 py-3 rounded-xl bg-[#0F172A] border text-white text-sm focus:outline-none transition-all placeholder-[#475569]
                  ${errors.title ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-[#334155] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] mb-1.5 uppercase tracking-widest">How much?</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] font-black">₹</span>
                <input
                  type="number" min="0.01" step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full pl-8 pr-4 py-3 rounded-xl bg-[#0F172A] border text-white text-sm font-bold focus:outline-none transition-all placeholder-[#475569]
                    ${errors.amount ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-[#334155] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
                />
              </div>
            </div>
          </div>

          {/* Paid By & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] mb-1.5 uppercase tracking-widest">Who Paid?</label>
              <div className="relative">
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer font-semibold"
                >
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] mb-1.5 uppercase tracking-widest">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white text-sm focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer font-semibold"
                >
                  {['Food', 'Travel', 'Shopping', 'Entertainment', 'Rent', 'Utilities', 'Others'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Split Type Toggle */}
          <div>
            <label className="block text-[10px] font-bold text-[#64748B] mb-2 uppercase tracking-widest">Split Options</label>
            <div className="flex p-1 rounded-xl bg-[#0F172A] border border-[#334155]">
              {SPLIT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSplitType(t.value)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    splitType === t.value 
                      ? 'bg-[#1E293B] text-white shadow-sm' 
                      : 'text-[#64748B] hover:text-[#94A3B8]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Split Calculation Preview */}
          {totalAmount > 0 && (
            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Instant Preview</span>
                {splitType === 'custom' && (
                  <span className={`text-[10px] font-bold ${Math.abs(customSum - totalAmount) < 0.01 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{customSum.toFixed(2)} / ₹{totalAmount.toFixed(2)}
                  </span>
                )}
                {splitType === 'percentage' && (
                  <span className={`text-[10px] font-bold ${Math.abs(pctSum - 100) < 0.01 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pctSum.toFixed(1)}% / 100%
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                {splitType === 'equal' && equalPreview.map((s) => {
                  const member = members.find((m) => m._id === s.user);
                  return (
                    <div key={s.user} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">{(member?.name || '?')[0]}</div>
                        <span className="text-sm font-semibold text-[#E2E8F0]">{member?.name}</span>
                      </div>
                      <span className="text-sm font-black text-white bg-[#1E293B] px-3 py-1 rounded-lg border border-[#334155]">₹{s.amount.toFixed(2)}</span>
                    </div>
                  );
                })}

                {splitType === 'custom' && splits.map((s, i) => (
                  <div key={s.user} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">{(s.name || '?')[0]}</div>
                      <span className="text-sm font-semibold text-[#E2E8F0] truncate">{s.name}</span>
                    </div>
                    <div className="relative w-32 shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] text-xs font-bold">₹</span>
                      <input
                        type="number" min="0" step="0.01"
                        value={s.amount}
                        onChange={(e) => updateSplitField(i, 'amount', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-white text-sm font-bold focus:outline-none focus:border-indigo-500 transition-all text-right"
                      />
                    </div>
                  </div>
                ))}

                {splitType === 'percentage' && splits.map((s, i) => (
                  <div key={s.user} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">{(s.name || '?')[0]}</div>
                      <span className="text-sm font-semibold text-[#E2E8F0] truncate">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {s.percentage && totalAmount > 0 && (
                        <span className="text-[10px] font-bold text-[#64748B]">≈ ₹{((parseFloat(s.percentage) / 100) * totalAmount).toFixed(2)}</span>
                      )}
                      <div className="relative w-20">
                        <input
                          type="number" min="0" max="100" step="0.1"
                          value={s.percentage}
                          onChange={(e) => updateSplitField(i, 'percentage', e.target.value)}
                          placeholder="0"
                          className="w-full pl-3 pr-6 py-1.5 rounded-lg bg-[#0F172A] border border-[#334155] text-white text-sm font-bold focus:outline-none focus:border-indigo-500 transition-all text-right"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] text-xs font-bold">%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.splits && <p className="text-rose-400 text-xs mt-3 font-medium bg-rose-500/10 p-2 rounded-lg">{errors.splits}</p>}
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="p-6 bg-[#0F172A]/80 border-t border-[#334155] backdrop-blur-md flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border border-[#334155] text-[#94A3B8] text-sm font-bold hover:bg-[#334155] hover:text-white transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
