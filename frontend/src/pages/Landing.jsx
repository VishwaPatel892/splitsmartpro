import { Link } from 'react-router-dom';
import { ArrowRight, PieChart, Shield, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800/50 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">SplitSmart <span className="text-indigo-400">Pro</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,1)]"></span>
            Now in Public Beta
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Split Expenses. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">
              Preserve Friendships.
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 mb-10 leading-relaxed">
            The intelligent way to track shared costs, settle debts seamlessly, and gain full visibility into your group finances. Built for roommates, trips, and everyday life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1 group flex items-center justify-center gap-2">
              Start Splitting Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all hover:text-white">
              See How It Works
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="mt-32 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Instant Settlements"
            description="Our smart algorithm calculates the minimum number of transactions to settle debts among friends."
          />
          <FeatureCard 
            icon={<PieChart className="w-6 h-6 text-emerald-400" />}
            title="Deep Insights"
            description="Visualize your spending patterns and understand exactly where your money goes every month."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-blue-400" />}
            title="Bank-grade Security"
            description="Your financial data is encrypted and protected with industry-leading security protocols."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
