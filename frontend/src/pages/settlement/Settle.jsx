import { formatCurrency, getCurrencySymbol } from '../../utils/currencyUtils.js';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, History, IndianRupee, Clock, CheckCircle2, 
  ArrowRight, Loader2, AlertCircle, Trash2, BadgeCheck, RotateCcw
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import { getSettlements } from '../../services/settlementService.js';
import { getGroupBalance } from '../../services/balanceService.js';
import { markGroupAsSettled, deleteGroup } from '../../services/groupService.js';
import SettleModal from '../../components/settlement/SettleModal.jsx';
import BalanceCard from '../../components/balance/BalanceCard.jsx';
import { toast } from '../../components/common/Toast.jsx';
import PageSEO from '../../components/common/PageSEO.jsx';

export default function Settle() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [balances, setBalances] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSettlement, setActiveSettlement] = useState(null);
  const [groupStatus, setGroupStatus] = useState('active'); // 'active' | 'settled'
  const [isMarkingSettled, setIsMarkingSettled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}')._id; }
    catch { return null; }
  })();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [balanceData, historyData] = await Promise.all([
        getGroupBalance(groupId),
        getSettlements(groupId)
      ]);
      setBalances(balanceData);
      setHistory(historyData);
      if (balanceData?.group?.status) setGroupStatus(balanceData.group.status);
    } catch (err) {
      setError(err.message || 'Failed to load settlement data');
      toast(err.message || 'Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const handleMarkSettled = async () => {
    setIsMarkingSettled(true);
    try {
      await markGroupAsSettled(groupId, 'settled');
      setGroupStatus('settled');
      toast('Group marked as settled! 🎉', 'success');
    } catch (err) {
      toast(err.message || 'Failed to mark settled', 'error');
    } finally {
      setIsMarkingSettled(false);
    }
  };

  const handleReactivate = async () => {
    setIsMarkingSettled(true);
    try {
      await markGroupAsSettled(groupId, 'active');
      setGroupStatus('active');
      toast('Group reactivated', 'success');
    } catch (err) {
      toast(err.message || 'Failed to reactivate', 'error');
    } finally {
      setIsMarkingSettled(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Delete this group permanently? This cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await deleteGroup(groupId);
      toast('Group deleted successfully', 'success');
      navigate('/groups');
    } catch (err) {
      toast(err.message || 'Failed to delete group', 'error');
      setIsDeleting(false);
    }
  };

  useEffect(() => { fetchData(); }, [fetchData]);

  const mySettlements = (balances?.simplifiedDebts || []).filter(
    (d) => d.from._id === currentUserId || d.to._id === currentUserId
  );

  const otherSettlements = (balances?.simplifiedDebts || []).filter(
    (d) => d.from._id !== currentUserId && d.to._id !== currentUserId
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white font-sans">
        <Navbar />
        <main className="max-w-2xl mx-auto px-6 pt-28 space-y-6">
          <div className="h-8 w-48 bg-[#1E293B] rounded-xl animate-pulse" />
          <div className="h-64 bg-[#1E293B] rounded-2xl animate-pulse" />
          <div className="h-64 bg-[#1E293B] rounded-2xl animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-16">
      <PageSEO title="Settle Up" description="Clear your balances and record payments within your group." path={`/settle/${groupId}`} />
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 pt-24">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#64748B] hover:text-white text-sm font-medium mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settle Up</h1>
            <p className="text-[#64748B] text-xs">Record payments to clear balances</p>
          </div>
        </div>

        {/* Suggested Payments */}
        <section className="mb-10">
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-4 flex items-center gap-2">
            <IndianRupee className="w-3 h-3" /> Suggested Payments
          </h2>
          
          <div className="space-y-3">
          {/* All Settled Banner */}
            {mySettlements.length === 0 && otherSettlements.length === 0 ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-emerald-300 mb-1">Everyone is all settled up!</h3>
                  <p className="text-sm text-[#94A3B8]">No pending payments in this group.</p>
                </div>

                {/* Settled / Delete Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupStatus !== 'settled' ? (
                    <button
                      onClick={handleMarkSettled}
                      disabled={isMarkingSettled}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-emerald-500/20"
                    >
                      {isMarkingSettled ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
                      Mark Group as Settled
                    </button>
                  ) : (
                    <button
                      onClick={handleReactivate}
                      disabled={isMarkingSettled}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-60"
                    >
                      {isMarkingSettled ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                      Reactivate Group
                    </button>
                  )}

                  <button
                    onClick={handleDeleteGroup}
                    disabled={isDeleting}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold text-sm hover:bg-rose-500/20 transition-all active:scale-95 disabled:opacity-60"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete Group
                  </button>
                </div>

                {groupStatus === 'settled' && (
                  <div className="flex items-center gap-2 justify-center">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">This group is marked as settled</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                {mySettlements.map((s, i) => (
                  <BalanceCard 
                    key={`my-${i}`} 
                    mode="settlement" 
                    {...s} 
                    currentUserId={currentUserId} 
                    onSettle={() => setActiveSettlement(s)}
                  />
                ))}
                
                {otherSettlements.length > 0 && (
                  <div className="pt-4">
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">Other group settlements</p>
                    <div className="space-y-3">
                      {otherSettlements.map((s, i) => (
                        <BalanceCard 
                          key={`other-${i}`} 
                          mode="settlement" 
                          {...s} 
                          currentUserId={currentUserId} 
                          onSettle={() => setActiveSettlement(s)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Settlement History */}
        <section>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-4 flex items-center gap-2">
            <History className="w-3 h-3" /> Settlement History
          </h2>
          
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="rounded-2xl bg-[#0F172A] border border-[#334155] p-10 text-center">
                <Clock className="w-8 h-8 text-[#1E293B] mx-auto mb-3" />
                <p className="text-[#475569] text-sm">No payment history yet</p>
              </div>
            ) : (
              history.map((h) => (
                <div key={h._id} className="rounded-xl bg-[#1E293B] border border-[#334155] p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-white font-medium mb-1">
                      <span className="truncate">{h.fromUser.name}</span>
                      <ArrowRight className="w-3 h-3 text-[#475569] shrink-0" />
                      <span className="truncate">{h.toUser.name}</span>
                    </div>
                    <p className="text-[10px] text-[#64748B]">
                      {new Date(h.createdAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">{formatCurrency(h.amount)}</p>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/50">Completed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Confirmation Modal */}
      {activeSettlement && (
        <SettleModal
          settlement={activeSettlement}
          groupId={groupId}
          onClose={() => setActiveSettlement(null)}
          onSettled={() => {
            toast('Payment settled successfully', 'success');
            fetchData();
          }}
        />
      )}
    </div>
  );
}
