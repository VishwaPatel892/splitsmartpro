import { formatCurrency, getCurrencySymbol } from '../../utils/currencyUtils.js';
import { ArrowUpRight, ArrowDownLeft, Minus } from 'lucide-react';

/**
 * BalanceCard — shows one user's net position relative to the current user,
 * OR a simplified debt settlement suggestion.
 *
 * Props:
 *  mode: 'balance' | 'settlement'
 *
 * balance mode:
 *   name, netBalance (from API), isCurrentUser, currentUserId
 *
 * settlement mode:
 *   from { _id, name }, to { _id, name }, amount, currentUserId
 */
export default function BalanceCard({ mode = 'balance', ...props }) {
  if (mode === 'settlement') {
    return <SettlementCard {...props} />;
  }
  return <NetBalanceCard {...props} />;
}

/* ── Net Balance Card ─────────────────────────────────────── */
function NetBalanceCard({ user, netBalance, isCurrentUser }) {
  const amount = Math.abs(netBalance);
  const owes   = netBalance < -0.01;
  const gets   = netBalance > 0.01;
  const settled = !owes && !gets;

  const config = owes
    ? { icon: ArrowUpRight, bg: 'bg-rose-500/10', border: 'border-rose-500/20', iconColor: 'text-rose-400', badge: 'text-rose-300 bg-rose-500/10 border-rose-500/20', badgeText: 'Owes', amountColor: 'text-rose-300' }
    : gets
    ? { icon: ArrowDownLeft, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', iconColor: 'text-emerald-400', badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20', badgeText: 'Gets Back', amountColor: 'text-emerald-300' }
    : { icon: Minus, bg: 'bg-[#334155]/30', border: 'border-[#334155]', iconColor: 'text-[#64748B]', badge: 'text-[#64748B] bg-[#334155]/30 border-[#334155]', badgeText: 'Settled', amountColor: 'text-[#64748B]' };

  const Icon = config.icon;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-4 flex items-center gap-4 transition-all hover:scale-[1.01]`}>
      <div className={`p-2.5 rounded-xl ${config.bg} border ${config.border} shrink-0`}>
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-white truncate">
            {user.name}
            {isCurrentUser && <span className="text-[#64748B] font-normal"> (you)</span>}
          </p>
          <span className={`text-[10px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded-full ${config.badge}`}>
            {config.badgeText}
          </span>
        </div>
        <p className="text-xs text-[#64748B] truncate">{user.email}</p>
      </div>

      <div className="text-right shrink-0">
        <p className={`text-base font-bold ${config.amountColor}`}>
          {settled ? '—' : `${formatCurrency(amount)}`}
        </p>
      </div>
    </div>
  );
}

/* ── Settlement Suggestion Card ───────────────────────────── */
function SettlementCard({ from, to, amount, currentUserId, onSettle }) {
  const youPay     = from._id === currentUserId;
  const youReceive = to._id   === currentUserId;

  let heading, subtext, borderColor, bg, amountColor;

  if (youPay) {
    heading     = `Pay ${to.name}`;
    subtext     = `You owe ₹${amount.toFixed(2)}`;
    borderColor = 'border-rose-500/25';
    bg          = 'bg-rose-500/5';
    amountColor = 'text-rose-300';
  } else if (youReceive) {
    heading     = `Collect from ${from.name}`;
    subtext     = `Owes you ₹${amount.toFixed(2)}`;
    borderColor = 'border-emerald-500/25';
    bg          = 'bg-emerald-500/5';
    amountColor = 'text-emerald-300';
  } else {
    heading     = `${from.name} → ${to.name}`;
    subtext     = `Indirect settlement`;
    borderColor = 'border-[#334155]';
    bg          = 'bg-[#0F172A]';
    amountColor = 'text-[#94A3B8]';
  }

  return (
    <div className={`rounded-xl border ${borderColor} ${bg} p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:scale-[1.01]`}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">{heading}</p>
        <p className="text-xs text-[#64748B] mt-0.5">{subtext}</p>
        <p className={`text-xl font-black mt-2 ${amountColor}`}>{formatCurrency(amount)}</p>
      </div>
      
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
        {onSettle && youPay && (
          <button
            onClick={(e) => { e.stopPropagation(); onSettle(); }}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 text-center"
          >
            Pay Now
          </button>
        )}
        {onSettle && youReceive && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); toast('Payment request sent!', 'info'); }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest hover:bg-indigo-500/10 transition-all active:scale-95 text-center"
            >
              Request
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onSettle(); }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#334155] transition-all active:scale-95 text-center"
            >
              Mark as Paid
            </button>
          </>
        )}
        {onSettle && !youPay && !youReceive && (
          <button
            onClick={(e) => { e.stopPropagation(); onSettle(); }}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] text-xs font-bold uppercase tracking-widest hover:text-white hover:bg-[#334155] transition-all active:scale-95 text-center"
          >
            Mark Settled
          </button>
        )}
      </div>
    </div>
  );
}
