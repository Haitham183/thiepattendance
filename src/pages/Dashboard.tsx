import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  UserPlus,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', attendance: 85, performance: 70 },
  { name: 'Feb', attendance: 88, performance: 72 },
  { name: 'Mar', attendance: 92, performance: 78 },
  { name: 'Apr', attendance: 90, performance: 85 },
];

const groupPerformance = [
  { name: 'Group A', score: 85 },
  { name: 'Group B', score: 72 },
  { name: 'Group C', score: 94 },
  { name: 'Group D', score: 68 },
];

export default function Dashboard() {
  const { t } = useTranslation();

  const stats = [
    { title: t('totalInstructors'), value: '24', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+2 this month' },
    { title: t('attendanceRate'), value: '91%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', trend: '+5% from last week' },
    { title: t('activeGroups'), value: '12', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100', trend: '3 ending soon' },
    { title: t('performanceLevel'), value: 'Very Good', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100', trend: 'Improving' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800 text-lg">{t('attendance')} & {t('evaluations')} Trend</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 4 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                <Area type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800 text-lg">Group Performance Comparison</h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity / Next Up */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Recent Enrollments</h3>
            <Link to="/trainees" className="text-blue-600 text-sm font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('fullName')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('jobId')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('groups')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4].map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold me-3">
                          JS
                        </div>
                        <span className="text-sm font-medium text-gray-900">John Smith</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">JOB-8829</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">React Advanced</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg">
                  <Calendar size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Monthly Evaluation - April</h4>
                  <p className="text-xs text-gray-500 mt-1">Due in 3 days • 48 trainees pending</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <UserPlus size={18} />
            Assign New Instructor
          </button>
        </div>
      </div>
    </div>
  );
}

// Small helper for internal links until fixed
function Link({ to, children, className }: { to: string, children: React.ReactNode, className?: string }) {
  return <a href={to} className={className}>{children}</a>;
}
