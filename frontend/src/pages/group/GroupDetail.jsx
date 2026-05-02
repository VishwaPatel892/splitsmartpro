import { formatCurrency, getCurrencySymbol } from '../../utils/currencyUtils.js';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, Copy, Check, Trash2, Plus, Receipt,
  Crown, Loader2, AlertTriangle, TrendingUp, Scale, Clock, 
  ArrowRight, CreditCard, ChevronRight, Share2, SplitSquareHorizontal, UserPlus
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import ExpenseCard from '../../components/expense/ExpenseCard.jsx';
import AddExpenseModal from '../../components/expense/AddExpenseModal.jsx';
import { getGroupById, deleteGroup } from '../../services/groupService.js';
import { getExpensesByGroup } from '../../services/expenseService.js';
import { getGroupBalance } from '../../services/balanceService.js';
import { getSettlements } from '../../services/settlementService.js';
import { toast } from '../../components/common/Toast.jsx';
import PageSEO from '../../components/common/PageSEO.jsx';

function BalanceTab({ balanceData, currentUserId, onSettleClick }) {
  if (!balanceData) return <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto" /></div>;

  const { balances, simplifiedDebts } = balanceData;
  const myNetBalance = balances.find(b => b.user._id === currentUserId)?.netBalance || 0;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Net Balance Highlight */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg ${
        myNetBalance > 0 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : myNetBalance < 0 
          ? 'bg-rose-500/10 border-rose-500/30' 
          : 'bg-[#1E293B] border-[#334155]'
      }`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Your Net Balance</p>
          <p className={`text-2xl font-black ${
            myNetBalance > 0 ? 'text-emerald-400' : myNetBalance < 0 ? 'text-rose-400' : 'text-white'
          }`}>
            {myNetBalance > 0 ? `+ ${formatCurrency(myNetBalance)}` : myNetBalance < 0 ? `- ${formatCurrency(Math.abs($1))}` : formatCurrency(0)}
          </p>
          <p className="text-[11px] font-medium text-[#64748B] mt-1">
            {myNetBalance > 0 ? 'You get back' : myNetBalance < 0 ? 'You owe overall' : 'You are completely settled up!'}
          </p>
        </div>
        {myNetBalance < 0 && (
          <button onClick={onSettleClick} className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all active:scale-95 w-full sm:w-auto">
            Settle Up Now
          </button>
        )}
      </div>

      {/* Simplified Debts */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3">Who owes whom</h3>
        {simplifiedDebts.length === 0 ? (
          <div className="text-center py-8 rounded-2xl border border-dashed border-[#334155]">
            <Check className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
            <p className="text-sm text-[#64748B]">All debts are settled!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {simplifiedDebts.map((debt, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`font-bold ${debt.from._id === currentUserId ? 'text-white' : 'text-[#94A3B8]'}`}>
                    {debt.from._id === currentUserId ? 'You' : debt.from.name}
                  </span>
                  <span className="text-[#64748B] text-xs">owes</span>
                  <span className={`font-bold ${debt.to._id === currentUserId ? 'text-white' : 'text-[#94A3B8]'}`}>
                    {debt.to._id === currentUserId ? 'You' : debt.to.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-rose-400">{formatCurrency(debt.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Per User Balances */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3">Net Balance per user</h3>
        <div className="space-y-2">
          {balances.map((b) => (
            <div key={b.user._id} className="p-3 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1E293B] flex items-center justify-center text-xs font-bold text-white">
                  {b.user.name[0]}
                </div>
                <p className="text-sm font-medium text-[#E2E8F0]">{b.user._id === currentUserId ? 'You' : b.user.name}</p>
              </div>
              <p className={`text-sm font-bold ${b.netBalance > 0 ? 'text-emerald-400' : b.netBalance < 0 ? 'text-rose-400' : 'text-[#64748B]'}`}>
                {b.netBalance > 0 ? `+ ${formatCurrency(b.netBalance)}` : b.netBalance < 0 ? `- ${formatCurrency(Math.abs(b.netBalance))}` : formatCurrency(0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ expenses, settlements, currentUserId }) {
  const allActivity = [
    ...expenses.map(e => ({
      id: e._id,
      type: 'expense',
      date: new Date(e.createdAt),
      text: `${e.paidBy._id === currentUserId ? 'You' : e.paidBy.name} added ${formatCurrency(e.amount)} for ${e.title}`,
      tag: e.splitType
    })),
    ...settlements.map(s => ({
      id: s._id,
      type: 'settlement',
      date: new Date(s.createdAt),
      text: `${s.fromUser._id === currentUserId ? 'You' : s.fromUser.name} settled ${formatCurrency(s.amount)} with ${s.toUser._id === currentUserId ? 'You' : s.toUser.name}`,
    }))
  ].sort((a, b) => b.date - a.date);

  if (allActivity.length === 0) {
    return (
      <div className="text-center py-16">
        <Clock className="w-10 h-10 text-[#334155] mx-auto mb-3" />
        <p className="text-sm text-[#64748B]">No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-4 space-y-6 animate-fade-up before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-[#334155]">
      {allActivity.map((item) => (
        <div key={item.id} className="relative pl-6">
          <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#0F172A] ${
            item.type === 'expense' ? 'bg-indigo-500' : 'bg-emerald-500'
          }`} />
          <div className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#475569] transition-colors">
            <p className="text-sm text-white mb-1 leading-snug">{item.text}</p>
            <div className="flex items-center justify-between gap-2 mt-2">
              <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-widest">
                {item.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              {item.type === 'expense' && (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#0F172A] text-indigo-400 border border-[#334155]">
                  {item.tag} split
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [balanceData, setBalanceData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [activeTab, setActiveTab] = useState('expenses'); // expenses, balances, activity
  const [showAddExpense, setShowAddExpense] = useState(false);

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem('splitsmart_user') || localStorage.getItem('user') || '{}')._id; }
    catch { return null; }
  })();

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const gData = await getGroupById(id);
      setGroup(gData);
      
      const [eData, sData, bData] = await Promise.all([
        getExpensesByGroup(id),
        getSettlements(id),
        getGroupBalance(id)
      ]);
      setExpenses(eData);
      setSettlements(sData);
      setBalanceData(bData);
    } catch (err) {
      setError(err.message || 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const handleCopyCode = async () => {
    if (!group?.inviteCode) return;
    await navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    toast('Invite code copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExpenseAdded = (expense) => {
    fetchAllData(); // Refresh everything to update balances and activity
  };

  const handleExpenseDeleted = (expenseId) => {
    fetchAllData();
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] font-sans">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 pt-28 space-y-4">
          <div className="h-40 bg-[#1E293B] rounded-3xl animate-pulse" />
          <div className="h-10 bg-[#1E293B] rounded-xl animate-pulse w-full max-w-sm" />
          <div className="h-64 bg-[#1E293B] rounded-2xl animate-pulse" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
        <Navbar />
        <main className="flex flex-col items-center justify-center flex-1">
          <AlertTriangle className="w-12 h-12 text-rose-400 mb-4" />
          <p className="text-rose-300 text-lg">{error}</p>
          <button onClick={() => navigate('/groups')} className="mt-4 px-4 py-2 bg-[#1E293B] rounded-xl">Back</button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-24">
      <PageSEO 
        title={group?.name || 'Group Details'} 
        description={`Manage expenses and balances for ${group?.name || 'your group'} on SplitSmart Pro.`}
        path={`/groups/${id}`}
      />
      <Navbar />

      {/* Floating Add Expense Button */}
      <button
        onClick={() => setShowAddExpense(true)}
        className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>

      <main className="max-w-4xl mx-auto px-4 pt-24">
        {/* Breadcrumb */}
        <button onClick={() => navigate('/groups')} className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-white uppercase tracking-widest mb-6 transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Groups
        </button>

        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#334155] p-6 sm:p-8 shadow-2xl mb-8 group/header">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{group.name}</h1>
              </div>
              <p className="text-[#94A3B8] text-sm max-w-lg leading-relaxed mb-6">
                {group.description || 'No description provided.'}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  {group.members.slice(0, 5).map((m, i) => (
                    <div key={m._id} className="w-8 h-8 rounded-full bg-[#334155] border-2 border-[#1E293B] flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-10 hover:z-20 hover:scale-110 transition-transform" title={m.name}>
                      {(m.name || '?')[0]}
                    </div>
                  ))}
                  {group.members.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-[#475569] border-2 border-[#1E293B] flex items-center justify-center text-[10px] font-bold text-white z-0">
                      +{group.members.length - 5}
                    </div>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#64748B] px-3 py-1 rounded-full bg-[#0F172A] border border-[#334155]">
                  {group.members.length} members
                </span>
                
                <button 
                  onClick={handleCopyCode} 
                  className="flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-full transition-colors active:scale-95 ml-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {copied ? 'Code Copied!' : 'Invite Members'}
                </button>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Total Group Spend</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#334155] pb-px overflow-x-auto custom-scrollbar">
          {[
            { id: 'expenses', label: 'Expenses', icon: Receipt },
            { id: 'balances', label: 'Balances', icon: Scale },
            { id: 'activity', label: 'Activity', icon: Clock }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === t.id 
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5 rounded-t-lg' 
                  : 'border-transparent text-[#64748B] hover:text-[#94A3B8] hover:bg-white/[0.02] rounded-t-lg'
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'expenses' && (
            <div className="space-y-3 animate-fade-up">
              {expenses.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#334155] rounded-2xl">
                  <Receipt className="w-10 h-10 text-[#334155] mx-auto mb-3" />
                  <p className="text-[#64748B] text-sm">No expenses yet</p>
                </div>
              ) : (
                expenses.map(exp => (
                  <ExpenseCard
                    key={exp._id}
                    expense={exp}
                    currentUserId={currentUserId}
                    isCreator={group.createdBy?._id === currentUserId}
                    onDeleted={handleExpenseDeleted}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'balances' && (
            <BalanceTab 
              balanceData={balanceData} 
              currentUserId={currentUserId} 
              onSettleClick={() => navigate(`/settle/${id}`)}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityTab 
              expenses={expenses} 
              settlements={settlements} 
              currentUserId={currentUserId} 
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddExpense && (
        <AddExpenseModal
          group={group}
          onClose={() => setShowAddExpense(false)}
          onAdded={handleExpenseAdded}
        />
      )}
    </div>
  );
}
