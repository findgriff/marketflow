
import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const METRICS = [
  { label: 'Gross Revenue', value: '$12,450.00', change: '+12.5%', trend: 'up', timeframe: '30D' },
  { label: 'Net Profit', value: '$9,840.50', change: '+10.2%', trend: 'up' },
  { label: 'Conversion Rate', value: '3.84%', change: '+0.4%', trend: 'up' },
  { label: 'Avg. Order Value', value: '$42.10', change: '-1.2%', trend: 'down' },
];

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4200, volume: 45 },
  { name: 'Tue', revenue: 3800, volume: 38 },
  { name: 'Wed', revenue: 5400, volume: 56 },
  { name: 'Thu', revenue: 7200, volume: 82 },
  { name: 'Fri', revenue: 6100, volume: 68 },
  { name: 'Sat', revenue: 8900, volume: 94 },
  { name: 'Sun', revenue: 9500, volume: 102 },
];

const CATEGORY_DATA = [
  { category: 'UI Kits', sales: 4500, color: '#0f7b79' },
  { category: 'Templates', sales: 3200, color: '#2dd4bf' },
  { category: 'Icons', sales: 2100, color: '#5eead4' },
  { category: 'Fonts', sales: 1800, color: '#99f6e4' },
];

const TOP_PRODUCTS = [
  { id: 1, name: 'Lumina Icon Pack', category: 'Icons', sales: 184, revenue: '$4,600.00', growth: '+14.2%', status: 'In Stock' },
  { id: 2, name: 'Auth Template Pro', category: 'Software', sales: 122, revenue: '$3,050.00', growth: '+8.1%', status: 'In Stock' },
  { id: 3, name: 'SaaS Design System', category: 'UI Kits', sales: 98, revenue: '$2,450.00', growth: '+22.5%', status: 'Update Soon' },
  { id: 4, name: 'Growth PDF Guide', category: 'E-books', sales: 85, revenue: '$1,275.00', growth: '-3.4%', status: 'In Stock' },
];

const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Revenue');
  const [timeframe, setTimeframe] = useState('Weekly');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-6 lg:p-10 pb-32">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              <span>Seller Central</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary">Sales Analytics</span>
            </nav>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Performance Overview</h2>
            <p className="text-slate-500 font-bold">Comprehensive insights into your marketplace growth.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              Select Period
            </button>
            <button className="h-12 px-8 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">download_for_offline</span>
              Download CSV
            </button>
          </div>
        </header>

        {/* High-Level Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((metric) => (
            <div key={metric.label} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-primary/30 hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{metric.label}</span>
                <div className={`flex items-center gap-0.5 text-xs font-black ${metric.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                   <span className="material-symbols-outlined text-sm leading-none">
                    {metric.trend === 'up' ? 'trending_up' : 'trending_down'}
                  </span>
                  {metric.change}
                </div>
              </div>
              <h3 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{metric.value}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">vs. previous period</p>
            </div>
          ))}
        </section>

        {/* Analytics Main Section */}
        <section className="grid grid-cols-12 gap-8">
          
          {/* Revenue Trends Chart */}
          <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">Revenue Trends</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Marketplace performance tracker</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl self-start">
                {['Revenue', 'Volume'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                      activeTab === tab ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f7b79" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0f7b79" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#0f7b79', strokeWidth: 2, strokeDasharray: '5 5' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      padding: '12px'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#0f7b79' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={activeTab.toLowerCase()} 
                    stroke="#0f7b79" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#revenueGradient)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 flex flex-col">
            <div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Sales by Category</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Revenue distribution</p>
            </div>
            
            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CATEGORY_DATA} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="sales" radius={[0, 8, 8, 0]} barSize={32}>
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              {CATEGORY_DATA.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.category}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">${item.sales}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products Table */}
          <div className="col-span-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">Top Performing Assets</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Based on revenue and growth</p>
              </div>
              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline transition-all">
                Full Inventory Report
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Units Sold</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Gross Growth</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {TOP_PRODUCTS.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
                            {product.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-sm font-black text-center text-slate-700 dark:text-slate-300">
                        {product.sales}
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className={`text-xs font-black ${product.growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                          {product.growth}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          product.status === 'In Stock' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className="text-sm font-black text-primary">{product.revenue}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-10 py-6 bg-slate-50 dark:bg-slate-800/50 flex justify-center">
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">
                Load More Results
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};

export default SellerDashboard;
