import { useState, useEffect } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

import StatCard from '../../components/dashboard/StatCard';
import QuickActions from '../../components/dashboard/QuickActions';
import AnalyticsChart from '../../components/dashboard/AnalyticsChart';
import ExpenseList from '../../components/dashboard/ExpenseList';
import GroupList from '../../components/dashboard/GroupList';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import Insights from '../../components/dashboard/Insights';
import SettlementHistory from '../../components/dashboard/SettlementHistory';
import { getUserSummary } from '../../services/balanceService.js';
import { getGroups } from '../../services/groupService.js';
import AddExpenseModal from '../../components/expense/AddExpenseModal.jsx';
import SelectGroupModal from '../../components/dashboard/SelectGroupModal.jsx';
import { toast } from '../../components/common/Toast.jsx';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [actionType, setActionType] = useState(''); // 'add' or 'settle'
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, groupsData] = await Promise.all([
          getUserSummary(),
          getGroups()
        ]);
        setSummary(summaryData);
        setGroups(groupsData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleActionClick = (type) => {
    if (groups.length === 0) {
      toast('Create a group first!', 'info');
      return;
    }
    
    setActionType(type);
    if (groups.length === 1) {
      handleGroupSelect(groups[0], type);
    } else {
      setIsSelectModalOpen(true);
    }
  };

  const handleGroupSelect = (group, type = actionType) => {
    setIsSelectModalOpen(false);
    if (type === 'add') {
      setSelectedGroup(group);
      setIsAddExpenseOpen(true);
    } else if (type === 'settle') {
      navigate(`/settle/${group._id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-12">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 pt-24">
          <div className="mb-8 space-y-2">
            <div className="h-9 w-48 bg-[#1E293B] rounded-xl animate-pulse" />
            <div className="h-4 w-64 bg-[#1E293B] rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-[500px] bg-[#1E293B] rounded-2xl animate-pulse" />
            <div className="lg:col-span-4 h-[500px] bg-[#1E293B] rounded-2xl animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans pb-12">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-24">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-[#94A3B8] mt-1">Welcome back, here's what's happening with your finances.</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-widest bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-2 hover:border-indigo-500/50 hover:text-[#F8FAFC] transition-all cursor-pointer group active:scale-95"
          >
            Refresh Dashboard
            <svg className="w-3 h-3 ml-1 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Balance" 
            amount={summary?.netBalance || 0} 
            type={summary?.netBalance >= 0 ? 'positive' : 'negative'}
            trend={summary?.netBalance >= 0 ? 'Stable' : 'Owed'} 
            description="Across all groups"
          />
          <StatCard 
            title="You Are Owed" 
            amount={summary?.totalOwedToUser || 0} 
            type="positive" 
            trend="Collect" 
            description={`From ${summary?.groupCount || 0} groups`}
            onClick={() => handleActionClick('settle')}
          />
          <StatCard 
            title="You Owe" 
            amount={summary?.totalUserOwes || 0} 
            type="negative" 
            trend="To Pay" 
            description="Pending settlements"
            onClick={() => handleActionClick('settle')}
          />
          <div 
            onClick={() => navigate('/pro')}
            className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-xl shadow-indigo-500/20 flex flex-col justify-between group cursor-pointer hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98] transition-all"
          >
             <div className="flex justify-between items-start">
               <div className="p-2 rounded-xl bg-white/20">
                 <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded text-white">Pro Plan</span>
             </div>
             <div>
               <p className="text-indigo-100 text-xs font-bold mb-1 uppercase tracking-wider">Active Groups</p>
               <h3 className="text-2xl font-bold text-white">{summary?.groupCount || 0}</h3>
             </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions 
          onAddExpense={() => handleActionClick('add')} 
          onSettleUp={() => handleActionClick('settle')} 
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Charts & Expenses) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="min-h-[380px]">
                <AnalyticsChart />
              </div>
              <div className="min-h-[380px]">
                <Insights />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ExpenseList />
              <SettlementHistory />
            </div>
          </div>

          {/* Right Column (Activity & Groups) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <GroupList />
            <ActivityFeed />
          </div>

        </div>

      </main>

      {/* Modals */}
      {isSelectModalOpen && (
        <SelectGroupModal
          title={actionType === 'add' ? 'Add Expense To...' : 'Settle Up In...'}
          groups={groups}
          onClose={() => setIsSelectModalOpen(false)}
          onSelect={handleGroupSelect}
        />
      )}

      {isAddExpenseOpen && selectedGroup && (
        <AddExpenseModal
          group={selectedGroup}
          onClose={() => setIsAddExpenseOpen(false)}
          onAdded={() => {
            // Refresh summary after adding expense
            getUserSummary().then(setSummary);
          }}
        />
      )}
    </div>
  );
}
