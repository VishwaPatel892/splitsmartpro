import { useEffect, useState } from 'react';
import { Plus, Check, UserPlus, Loader2, Receipt, ArrowRightLeft } from 'lucide-react';
import { getActivityFeed } from '../../services/balanceService.js';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityFeed()
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'expense': return <Receipt className="w-3 h-3" />;
      case 'settlement': return <Check className="w-3 h-3" />;
      case 'invite': return <UserPlus className="w-3 h-3" />;
      default: return <Plus className="w-3 h-3" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'expense': return 'bg-indigo-500';
      case 'settlement': return 'bg-emerald-500';
      default: return 'bg-violet-500';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-[#F8FAFC] mb-6 flex items-center justify-between">
        Real-time Activity
        {loading && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
      </h3>
      
      <div className="space-y-6 relative flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {!loading && activities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <ArrowRightLeft className="w-10 h-10 mb-3" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}

        <div className="absolute left-2.5 top-0 bottom-0 w-px bg-[#334155]" />
        
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex items-start gap-4 group cursor-pointer hover:bg-white/[0.02] p-2 -ml-2 rounded-xl transition-all">
            <div className={`mt-1 z-10 w-5 h-5 rounded-full ${getColor(activity.type)} flex items-center justify-center text-white ring-4 ring-[#1E293B] group-hover:scale-110 transition-transform shadow-lg shadow-black/20`}>
              {getIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#CBD5E1] group-hover:text-white transition-colors">
                <span className="font-bold text-[#F8FAFC]">{activity.user === 'You' ? 'You' : activity.user}</span> {activity.action}
              </p>
              <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-0.5 group-hover:text-indigo-400 transition-colors">
                {formatTime(activity.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
