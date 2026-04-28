import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', amount: 2400 },
  { name: 'Tue', amount: 1398 },
  { name: 'Wed', amount: 9800 },
  { name: 'Thu', amount: 3908 },
  { name: 'Fri', amount: 4800 },
  { name: 'Sat', amount: 3800 },
  { name: 'Sun', amount: 4300 },
];

export default function AnalyticsChart() {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 h-full flex flex-col hover:border-indigo-500/50 transition-all cursor-pointer group/chart active:scale-[0.99] hover:shadow-xl hover:shadow-indigo-500/5">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">Spending Analytics</h3>
          <p className="text-sm text-[#94A3B8]">Your weekly expense flow</p>
        </div>
        <select className="bg-[#0F172A] border border-[#334155] text-xs text-[#94A3B8] rounded-lg px-2 py-1 outline-none">
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              hide 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1E293B', 
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#F8FAFC'
              }}
              itemStyle={{ color: '#6366F1' }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#6366F1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmt)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
