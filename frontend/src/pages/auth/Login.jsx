import { useState } from 'react';
import { Link } from 'react-router-dom';
import LeftPanel from '../../components/auth/LeftPanel';
import AuthCard from '../../components/auth/AuthCard';
import PageSEO from '../../components/common/PageSEO.jsx';

export default function Login() {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'

  return (
    <div className="min-h-screen flex bg-[#0F172A] font-sans">
      <PageSEO 
        title={tab === 'login' ? 'Login' : 'Sign Up'}
        description="Join SplitSmart Pro to start tracking and splitting expenses effortlessly."
        path="/login"
      />
      {/* Left – marketing panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <LeftPanel />
      </div>

      {/* Right – auth card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative overflow-hidden">
        {/* subtle bg glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-700/10 blur-3xl" />
        </div>

        {/* mobile branding */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <DollarIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white">SplitSmart <span className="text-indigo-400">Pro</span></span>
        </div>

        <AuthCard tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}

function DollarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
