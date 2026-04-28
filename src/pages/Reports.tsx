import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Printer, 
  FileSpreadsheet, 
  ChevronRight,
  TrendingUp,
  Award,
  Clock,
  Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Present', value: 85, color: '#10b981' },
  { name: 'Absent', value: 5, color: '#ef4444' },
  { name: 'Late', value: 10, color: '#a855f7' },
];

export default function Reports() {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState<'individual' | 'group'>('individual');
  const [jobId, setJobId] = useState('');

  return (
    <div className="space-y-8">
      {/* Search & Selector */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit">
            <button 
              onClick={() => setReportType('individual')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${reportType === 'individual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Individual Report
            </button>
            <button 
              onClick={() => setReportType('group')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${reportType === 'group' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Group Performance
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
              <FileSpreadsheet size={18} className="text-green-600" />
              Export .XLSX
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              <Printer size={18} />
              {t('printReport')}
            </button>
          </div>
        </div>

        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder={reportType === 'individual' ? "Enter Job ID to generate report..." : "Select Group to generate report..."}
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Report Content - Print Friendly Area */}
      <div id="printable-report" className="space-y-8 print:p-0">
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          {/* Subtle Watermark for Professionalism */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Academic Record Report</h2>
              <p className="text-gray-500 font-medium">Generated on {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="text-end">
              <div className="text-blue-600 font-black text-2xl tracking-tighter">ACADEMIASync</div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-1">Technical Training Institute</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Trainee Name</span>
                  <p className="text-lg font-bold text-gray-800 mt-1">Ahmed Mohammed Ali</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Specialization</span>
                  <p className="text-lg font-bold text-gray-800 mt-1">Web Development</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="p-5 text-center">
                   <div className="text-3xl font-black text-blue-600">88.5%</div>
                   <div className="text-[10px] uppercase font-bold text-gray-400 mt-2">Attend. Rate</div>
                </div>
                <div className="p-5 text-center border-x border-gray-100">
                   <div className="text-3xl font-black text-green-600">92/100</div>
                   <div className="text-[10px] uppercase font-bold text-gray-400 mt-2">Avg. Evaluation</div>
                </div>
                <div className="p-5 text-center">
                   <div className="text-3xl font-black text-purple-600">A+</div>
                   <div className="text-[10px] uppercase font-bold text-gray-400 mt-2">Final Grade</div>
                </div>
              </div>
            </div>

            {/* Attendance Chart */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center">
               <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex gap-4 mt-4">
                 {data.map(d => (
                   <div key={d.name} className="flex items-center gap-1.5">
                     <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}} />
                     <span className="text-[10px] font-bold text-gray-500 uppercase">{d.name}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Monthly Score Details</h3>
            <div className="overflow-hidden border border-gray-100 rounded-2xl">
              <table className="w-full text-start">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">Month</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">Tech Score</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">Behav. Score</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">Avg.</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 italic">
                  <tr>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">January 2024</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">85</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">90</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900">87.5%</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-black text-blue-600 uppercase">Very Good</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">February 2024</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">92</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">95</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900">93.5%</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-black text-green-600 uppercase">Excellent</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 flex justify-between items-center bg-gray-50 p-6 rounded-2xl border-dashed border-2 border-gray-200">
            <div className="flex items-center gap-4">
              <Award className="text-blue-600" size={32} />
              <div>
                <p className="text-sm font-bold text-gray-900">Official Institute Certificate Eligible</p>
                <p className="text-xs text-gray-500">Verification ID: AS-2024-X8221</p>
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 h-1 bg-gray-300 mb-2 mx-auto" />
              <p className="text-[10px] font-bold text-gray-400 uppercase">Academic Supervisor Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
