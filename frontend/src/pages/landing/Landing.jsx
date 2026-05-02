import { formatCurrency, getCurrencySymbol } from '../../utils/currencyUtils.js';
import { Link } from 'react-router-dom';
import PageSEO from '../../components/common/PageSEO.jsx';

/* ── Inline SVG Icons ── */
const IconCheck = () => <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const IconLock = () => <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IconChart = () => <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const IconGroup = () => <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const IconBolt = () => <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconGlobe = () => <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconWallet = () => <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>; // Used Globe for Multi-currency, Wallet could be Smart Expense. Using Globe for multi-currency, and Wallet for Smart Expense:
const IconMoney = () => <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

/* ── Components ── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/70 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <IconMoney className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">SplitSmart <span className="text-indigo-400">Pro</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link to="/pro" className="hover:text-indigo-400 font-bold transition-colors">Pro Plan</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors hidden sm:block">
            Login
          </Link>
          <Link to="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroDashboardMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:ml-auto">
      <div className="absolute inset-0 rounded-[2rem] bg-indigo-600/20 blur-3xl scale-90" />
      <div className="relative rounded-2xl border border-white/10 bg-[#1E293B]/60 backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-[#94A3B8]">Total Balance</p>
            <p className="text-3xl font-bold text-white mt-1">{formatCurrency(342500)}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <IconChart />
          </div>
        </div>

        {/* Chart Bars */}
        <div className="flex items-end gap-2 h-20 mb-6">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 9 ? 'linear-gradient(to top, #6366F1, #818CF8)' : `rgba(99,102,241,${0.15 + (i % 3) * 0.1})` }} />
          ))}
        </div>

        {/* Expenses */}
        <div className="space-y-4">
          {[
            { name: 'Goa Trip Flights', amount: `- ${formatCurrency(18500)}`, color: 'text-red-400', avatar: '✈️' },
            { name: 'Dinner at Taj', amount: `- ${formatCurrency(6200)}`, color: 'text-red-400', avatar: '🍽️' },
            { name: 'Rahul Paid You', amount: `+ ${formatCurrency(4000)}`, color: 'text-emerald-400', avatar: '💸' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-t border-white/5 pt-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.avatar}</span>
                <span className="text-sm font-medium text-[#CBD5E1]">{item.name}</span>
              </div>
              <span className={`text-sm font-bold ${item.color}`}>{item.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cards */}
      <div className="absolute -top-6 -right-8 animate-fade-up flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-[#0F2A1F]/90 backdrop-blur-md px-4 py-3 shadow-xl" style={{ animationDelay: '0.2s' }}>
        <IconCheck />
        <span className="text-sm font-medium text-emerald-400">Group settled ✔</span>
      </div>
      
      <div className="absolute -bottom-8 -left-8 animate-fade-up flex items-center gap-3 rounded-xl border border-red-500/30 bg-[#2A0F17]/90 backdrop-blur-md px-4 py-3 shadow-xl" style={{ animationDelay: '0.4s' }}>
        <span className="text-xl">💳</span>
        <span className="text-sm font-medium text-red-300">You owe ${formatCurrency(450)}</span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0F172A] font-sans text-[#F8FAFC] selection:bg-indigo-500/30">
      <PageSEO 
        title="Smart Expense Tracking"
        description="SplitSmart Pro – Track, split, and settle shared expenses with friends, roommates, and teams. Fast, secure, and effortless."
      />
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-700/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
          <div className="animate-fade-up max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Split expenses <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                smarter. Not harder.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#94A3B8] leading-relaxed">
              Track, split, and manage shared expenses with friends, roommates, and teams — instantly and securely.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/login" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-1 text-center">
                Get Started Free
              </Link>
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 px-8 rounded-xl backdrop-blur-sm transition-all text-center">
                Watch Demo
              </button>
            </div>
            <p className="mt-4 text-sm text-[#475569] font-medium flex items-center justify-center lg:justify-start gap-2">
              <IconCheck /> No credit card required
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <HeroDashboardMockup />
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-24 bg-[#0B1120] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to manage money together.</h2>
            <p className="mt-4 text-[#94A3B8]">Stop chasing people for money. SplitSmart automates the math.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <IconMoney />, title: "Smart Expense Tracking", desc: "Log who paid what and when in seconds." },
              { icon: <IconGroup />, title: "Group Bill Splitting", desc: "Create groups for trips, apartments, or events." },
              { icon: <IconLock />, title: "Bank-Level Security", desc: "Your financial data is encrypted and secure." },
              { icon: <IconBolt />, title: "Instant Settlements", desc: "See exactly who owes who with simplified debts." },
              { icon: <IconChart />, title: "Visual Analytics", desc: "Understand your spending habits with gorgeous charts." },
              { icon: <IconGlobe />, title: "Multi-currency", desc: "Traveling? We automatically convert and split expenses." },
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-[#1E293B]/30 border border-white/5 hover:border-indigo-500/30 hover:bg-[#1E293B]/60 transition-all cursor-default">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-[#94A3B8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-600/0 via-indigo-600/50 to-indigo-600/0" />
            
            {[
              { step: "01", title: "Create Group", desc: "Add friends or roommates instantly to a shared space." },
              { step: "02", title: "Add Expenses", desc: "Track shared spending in real time. We do the math." },
              { step: "03", title: "Settle Instantly", desc: "Split and pay with one click using simplified debts." },
            ].map((s, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#1E293B] border-4 border-[#0F172A] flex items-center justify-center text-2xl font-bold text-indigo-400 shadow-xl shadow-indigo-500/10 z-10 mb-6">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-[#94A3B8] max-w-[250px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY SECTION ── */}
      <section id="security" className="py-24 bg-[#0B1120] border-y border-white/5 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6">
              <IconLock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Your money,<br/>fully protected.</h2>
            <p className="text-[#94A3B8] text-lg mb-8">We take security seriously. SplitSmart uses enterprise-grade encryption to ensure your financial data is safe.</p>
            <ul className="space-y-4">
              {['End-to-end 256-bit encryption', 'Secure Google OAuth authentication', 'Advanced fraud detection system', 'We never sell your personal data'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white font-medium">
                  <IconCheck /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#1E293B]/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <pre className="text-xs text-emerald-400 font-mono overflow-x-auto">
              <code>
{`// Security Verification
const verifyEncryption = async (payload) => {
  const isSecure = await crypto.verify(payload);
  if (!isSecure) throw new SecurityError();
  
  return {
    status: 'ENCRYPTED',
    level: 'AES-256-GCM',
    safeToProceed: true
  };
};`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Loved by thousands</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "SplitSmart made our Euro trip expenses effortless. No more awkward money talks at dinner.", author: "Rahul K.", role: "Traveler" },
              { quote: "Living with 4 roommates used to be a nightmare for bills. Now it takes 2 seconds to settle up.", author: "Sarah M.", role: "Student" },
              { quote: "The UI is gorgeous and it just works. The simplified debt feature saved us so much confusion.", author: "David C.", role: "Software Engineer" },
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-2xl bg-[#1E293B]/40 border border-white/5">
                <div className="flex gap-1 mb-6 text-indigo-400">
                  {'★★★★★'.split('').map((star, j) => <span key={j}>{star}</span>)}
                </div>
                <p className="text-lg mb-6 leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-bold">{t.author}</p>
                  <p className="text-sm text-[#94A3B8]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 bg-[#0B1120] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-[#94A3B8]">Start for free, upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-[#1E293B]/30 border border-white/5">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-[#94A3B8] text-sm mb-6">Perfect for small trips and roommates.</p>
              <div className="mb-6"><span className="text-4xl font-bold">Free</span></div>
              <ul className="space-y-4 mb-8">
                {['Up to 3 active groups', 'Basic expense tracking', 'Standard support'].map((item, i) => <li key={i} className="flex gap-2 text-sm"><IconCheck/> {item}</li>)}
              </ul>
              <Link to="/login" className="block text-center w-full bg-white/10 hover:bg-white/20 font-semibold py-3 rounded-xl transition-colors">Get Started</Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl bg-[#1E293B] border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-indigo-200 text-sm mb-6">For power users who want analytics.</p>
              <div className="mb-6"><span className="text-4xl font-bold">$5</span><span className="text-[#94A3B8]">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Unlimited groups', 'Advanced analytics & charts', 'Multi-currency support', 'Priority support'].map((item, i) => <li key={i} className="flex gap-2 text-sm"><IconCheck/> {item}</li>)}
              </ul>
              <Link to="/pro" className="block text-center w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors">Go Pro</Link>
            </div>

            {/* Team */}
            <div className="p-8 rounded-3xl bg-[#1E293B]/30 border border-white/5">
              <h3 className="text-xl font-bold mb-2">Team</h3>
              <p className="text-[#94A3B8] text-sm mb-6">For large organizations and clubs.</p>
              <div className="mb-6"><span className="text-4xl font-bold">$12</span><span className="text-[#94A3B8]">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Everything in Pro', 'Custom roles & permissions', 'API Access', 'Dedicated account manager'].map((item, i) => <li key={i} className="flex gap-2 text-sm"><IconCheck/> {item}</li>)}
              </ul>
              <Link to="/login" className="block text-center w-full bg-white/10 hover:bg-white/20 font-semibold py-3 rounded-xl transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-violet-900/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start splitting smarter today.</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-xl mx-auto">Join thousands of users who have revolutionized the way they share expenses.</p>
          <Link to="/login" className="inline-block bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-lg py-4 px-10 rounded-xl shadow-xl transition-transform hover:-translate-y-1">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#020617] py-12 border-t border-white/10 text-sm text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IconMoney className="w-5 h-5 text-indigo-400" />
              <span className="text-white font-bold text-base">SplitSmart Pro</span>
            </div>
            <p>Smart expense tracking made simple.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} SplitSmart Pro. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Social icons placeholder */}
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
