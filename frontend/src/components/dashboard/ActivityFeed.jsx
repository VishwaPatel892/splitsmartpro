import { Plus, Check, UserPlus } from 'lucide-react';

const activities = [
  { id: 1, user: 'Rahul', action: 'added an expense of ₹1,200', time: '5m ago', icon: <Plus className="w-3 h-3" />, color: 'bg-indigo-500' },
  { id: 2, user: 'Sneha', action: 'settled her debt of ₹450', time: '20m ago', icon: <Check className="w-3 h-3" />, color: 'bg-emerald-500' },
  { id: 3, user: 'You', action: 'invited Alex to "Goa Trip"', time: '1h ago', icon: <UserPlus className="w-3 h-3" />, color: 'bg-violet-500' },
  { id: 4, user: 'Amit', action: 'added an expense of ₹800', time: '3h ago', icon: <Plus className="w-3 h-3" />, color: 'bg-indigo-500' },
];

export default function ActivityFeed() {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 h-full">
      <h3 className="text-lg font-bold text-[#F8FAFC] mb-6">Real-time Activity</h3>
      <div className="space-y-6 relative">
        <div className="absolute left-2.5 top-0 bottom-0 w-px bg-[#334155]" />
        
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex items-start gap-4 pl-1 group cursor-pointer hover:bg-white/[0.02] p-2 -ml-2 rounded-xl transition-all">
            <div className={`mt-1 z-10 w-5 h-5 rounded-full ${activity.color} flex items-center justify-center text-white ring-4 ring-[#1E293B] group-hover:scale-110 transition-transform shadow-lg shadow-black/20`}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#CBD5E1] group-hover:text-white transition-colors">
                <span className="font-bold text-[#F8FAFC]">{activity.user}</span> {activity.action}
              </p>
              <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-0.5 group-hover:text-indigo-400 transition-colors">{activity.time}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
