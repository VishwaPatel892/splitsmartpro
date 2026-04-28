import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Scale, RefreshCw, TrendingUp, TrendingDown,
  CheckCircle2, AlertTriangle, Loader2, ChevronRight,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import BalanceCard from '../../components/balance/BalanceCard.jsx';
import { getGroupBalance } from '../../services/balanceService.js';
import { toast } from '../../components/common/Toast.jsx';

/* ── Summary stat box ──────────────────────────────────────── */
function StatBox({ label, value, color, icon: Icon }) {
  return (
    <div className="flex-1 rounded-xl bg-[#1E293B] border border-[#334155] p-4 text-center">
      <div className={`flex items-center justify-center gap-1 mb-1 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-[#64748B] mt-1 font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function Balance() {
  const { groupId } = useParams();
  const navigate    = useNavigate();

  const [data, setData]       = useState(null); // { balances, simplifiedDebts }
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState('balances'); // 'balances' | 'settlements'

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}')._id; }
    catch { return null; }
  })();

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getGroupBalance(groupId);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load balances');
      toast(err.message || 'Failed to load balances', 'error');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  /* ── Derived stats ── */
  const myBalance = data?.balances.find((b) => b.user._id === currentUserId);
  const myNet     = myBalance?.netBalance || 0;
  const iOwe      = myNet < -0.01 ? Math.abs(myNet) : 0;
  const iAmOwed   = myNet > 0.01  ? myNet            : 0;
  const settled   = !iOwe && !iAmOwed;

  const mySettlements = (data?.simplifiedDebts || []).filter(
    (d) => d.from._id === currentUserId || d.to._id === currentUserId
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white font-sans">
        <Navbar />
        <main className="max-w-2xl mx-auto px-6 pt-28 space-y-4">
          <div className="h-8 w-40 bg-[#1E293B] rounded-xl animate-pulse" />
          <div className="flex gap-3">
            {[1,2,3].map(i => <div key={i} className="flex-1 h-20 bg-[#1E293B] rounded-xl animate-pulse" />)}
          </div>
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-[#1E293B] rounded-xl animate-pulse" />)}
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
          <p className="text-rose-300 font-semibold">{error}</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-sm font-semibold hover:bg-[#334155] transition-all">Go Back</button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-16">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 pt-24">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#64748B] hover:text-white text-sm font-medium mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Scale className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Balances</h1>
              <p className="text-[#64748B] text-xs">Who owes whom in this group</p>
            </div>
          </div>
          <button
            onClick={fetchBalance}
            className="p-2.5 rounded-xl border border-[#334155] text-[#64748B] hover:text-white hover:bg-[#334155] transition-all active:scale-95"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* YOUR SUMMARY ─────────────────────────── */}
        {settled ? (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 flex items-center gap-4 mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <p className="text-emerald-300 font-bold text-base">You're all settled up! 🎉</p>
              <p className="text-emerald-400/60 text-xs mt-0.5">No outstanding balances for you in this group.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#1E293B] border border-[#334155] p-5 mb-6">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3">Your Summary</p>
            <div className="flex gap-3">
              <StatBox label="You Owe"      value={iOwe    ? `₹${iOwe.toFixed(2)}`    : '—'} color="text-rose-300"    icon={TrendingDown} />
              <StatBox label="You Get Back" value={iAmOwed ? `₹${iAmOwed.toFixed(2)}` : '—'} color="text-emerald-300" icon={TrendingUp}   />
            </div>

            {/* My settlement suggestions */}
            {mySettlements.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">Your Actions</p>
                {mySettlements.map((s, i) => (
                  <BalanceCard key={i} mode="settlement" {...s} currentUserId={currentUserId} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TABS ─────────────────────────────────── */}
        <div className="flex bg-[#0F172A] rounded-xl p-1 border border-[#334155] mb-5">
          {[
            { key: 'balances',    label: 'All Balances' },
            { key: 'settlements', label: `Settlements (${data?.simplifiedDebts.length || 0})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all
                ${tab === t.key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ALL BALANCES TAB ────────────────────── */}
        {tab === 'balances' && (
          <div className="space-y-2">
            {data?.balances.length === 0 ? (
              <EmptyState message="No members in this group yet." />
            ) : (
              data.balances.map((b) => (
                <BalanceCard
                  key={b.user._id}
                  mode="balance"
                  user={b.user}
                  netBalance={b.netBalance}
                  isCurrentUser={b.user._id === currentUserId}
                />
              ))
            )}
          </div>
        )}

        {/* SETTLEMENTS TAB ─────────────────────── */}
        {tab === 'settlements' && (
          <div className="space-y-2">
            {!data?.simplifiedDebts.length ? (
              <div className="rounded-2xl border border-dashed border-[#334155] p-10 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400/40 mx-auto mb-3" />
                <p className="text-[#64748B] text-sm font-medium">All settled up!</p>
                <p className="text-[#475569] text-xs mt-1">No transactions needed.</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#475569] mb-3">
                  {data.simplifiedDebts.length} transaction{data.simplifiedDebts.length !== 1 ? 's' : ''} needed to settle all debts.
                </p>
                {data.simplifiedDebts.map((s, i) => (
                  <BalanceCard key={i} mode="settlement" {...s} currentUserId={currentUserId} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Link back to group */}
        <div className="mt-8 text-center">
          <Link
            to={`/groups/${groupId}`}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            View Group & Expenses <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#334155] p-10 text-center">
      <p className="text-[#64748B] text-sm">{message}</p>
    </div>
  );
}
