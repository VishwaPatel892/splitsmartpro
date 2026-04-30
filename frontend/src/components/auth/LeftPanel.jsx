import { formatCurrency, getCurrencySymbol } from '../../utils/currencyUtils.js';
/* Left marketing / illustration panel */
export default function LeftPanel() {
  return (
    <div className="relative w-full flex flex-col overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f0f2e] to-[#1a0533]">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-600/20 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-700/15 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-500/10 blur-[60px]" />
      </div>

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative z-10 flex flex-col h-full px-12 py-10">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">SplitSmart <span className="text-indigo-400">Pro</span></span>
        </div>

        {/* Headline */}
        <div className="mt-16">
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
            Smart expense<br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              tracking made simple
            </span>
          </h2>
          <p className="mt-4 text-[#94A3B8] text-base leading-relaxed max-w-sm">
            Split bills, track balances, and settle debts effortlessly — all in one beautifully designed app.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-12 flex-1 flex items-center justify-center">
          <DashboardMockup />
        </div>

        {/* Feature highlights */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { icon: '🔒', label: 'Secure & Private' },
            { icon: '📊', label: 'Track Expenses' },
            { icon: '👥', label: 'Group Splitting' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-4 text-center">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium text-[#94A3B8] leading-tight">{label}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-[#475569] text-center">Trusted by 50,000+ users worldwide</p>
      </div>
    </div>
  );
}

/* SVG Dashboard Mockup */
function DashboardMockup() {
  return (
    <div className="relative w-full max-w-sm">
      {/* Glow behind card */}
      <div className="absolute inset-0 rounded-3xl bg-indigo-600/20 blur-2xl scale-95" />

      {/* Main card */}
      <div className="relative rounded-2xl border border-white/10 bg-[#1E293B]/80 backdrop-blur-md p-5 shadow-2xl">

        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#94A3B8]">Total Balance</p>
            <p className="text-2xl font-bold text-white mt-0.5">{formatCurrency(342520)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>

        {/* Mini chart bars */}
        <div className="flex items-end gap-1.5 h-16 mb-4">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: i === 11
                  ? 'linear-gradient(to top, #6366F1, #818CF8)'
                  : `rgba(99,102,241,${0.15 + (i % 3) * 0.1})`,
              }}
            />
          ))}
        </div>

        {/* Expense rows */}
        {[
          { name: 'Dinner at Nobu', amount: `- ${formatCurrency(3840)}`, color: 'text-red-400', avatar: '🍽️' },
          { name: 'Uber Pool Split', amount: `+ ${formatCurrency(1000)}`, color: 'text-emerald-400', avatar: '🚗' },
          { name: 'Airbnb Weekend', amount: `- ${formatCurrency(9600)}`, color: 'text-red-400', avatar: '🏠' },
        ].map(({ name, amount, color, avatar }) => (
          <div key={name} className="flex items-center justify-between py-2.5 border-t border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{avatar}</span>
              <span className="text-xs font-medium text-[#CBD5E1]">{name}</span>
            </div>
            <span className={`text-xs font-semibold ${color}`}>{amount}</span>
          </div>
        ))}

        {/* Progress bar */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#94A3B8]">Monthly budget</span>
            <span className="text-indigo-400 font-semibold">68%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#0F2A1F]/90 backdrop-blur px-3 py-2 shadow-lg">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-medium text-emerald-400">3 settled today</span>
      </div>

      {/* Floating group badge */}
      <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-[#1E1B4B]/90 backdrop-blur px-3 py-2 shadow-lg">
        <span className="text-sm">👥</span>
        <span className="text-xs font-medium text-indigo-300">Vegas Trip · 6 members</span>
      </div>
    </div>
  );
}
