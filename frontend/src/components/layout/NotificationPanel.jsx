import { useState, useRef, useEffect } from 'react';
import { Bell, Check, DollarSign, Users, Receipt, CheckCircle2 } from 'lucide-react';

const DUMMY_NOTIFICATIONS = [
  { id: 1, type: 'payment', title: 'Payment Reminder', message: 'You owe Rahul ₹500.00 for Dinner.', time: '10m ago', read: false },
  { id: 2, type: 'expense', title: 'New Expense', message: 'Sneha added "Movie Tickets" (₹1200.00).', time: '1h ago', read: false },
  { id: 3, type: 'group', title: 'Added to Group', message: 'You were added to "Goa Trip 2026".', time: '2h ago', read: true },
  { id: 4, type: 'payment', title: 'Payment Received', message: 'Vishwa paid you ₹250.00.', time: '1d ago', read: true },
];

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all | payments | groups | expenses
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'payment': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'group': return <Users className="w-4 h-4 text-indigo-400" />;
      case 'expense': return <Receipt className="w-4 h-4 text-amber-400" />;
      default: return <Bell className="w-4 h-4 text-[#94A3B8]" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'payments') return n.type === 'payment';
    if (filter === 'groups') return n.type === 'group';
    return true;
  });

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0F172A]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-up">
          {/* Header */}
          <div className="p-4 border-b border-[#334155] bg-[#0F172A]/50 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="px-4 py-2 border-b border-[#334155] bg-[#1E293B] flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {['all', 'payments', 'groups'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filter === f ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-[#64748B] hover:text-white hover:bg-[#334155]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-[#334155] mx-auto mb-2" />
                <p className="text-[#64748B] text-xs">No notifications found.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#334155]">
                {filteredNotifications.map(notification => (
                  <div key={notification.id} className={`p-4 hover:bg-[#0F172A]/40 transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-[#0F172A]/20' : ''}`}>
                    <div className="shrink-0 mt-0.5">
                      <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-[#334155] flex items-center justify-center">
                        {getIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className={`text-sm font-semibold truncate ${!notification.read ? 'text-white' : 'text-[#94A3B8]'}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-[#64748B] whitespace-nowrap">{notification.time}</span>
                      </div>
                      <p className={`text-xs ${!notification.read ? 'text-[#CBD5E1]' : 'text-[#64748B]'}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="shrink-0 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 border-t border-[#334155] bg-[#0F172A]/50 text-center">
            <button className="text-xs font-bold text-[#64748B] hover:text-white transition-colors">
              View All Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
