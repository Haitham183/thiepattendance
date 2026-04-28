import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download,
  Filter,
  Check,
  X,
  Info
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isSameDay } from 'date-fns';
import * as XLSX from 'xlsx';

const codes = [
  { code: 'P', label: 'Present', color: 'bg-green-100 text-green-700 border-green-200' },
  { code: 'A', label: 'Absent', color: 'bg-red-100 text-red-700 border-red-200' },
  { code: 'E', label: 'Excused', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { code: 'H', label: 'Half Day', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { code: 'L', label: 'Late', color: 'bg-purple-100 text-purple-700 border-purple-200' },
];

export default function Attendance() {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const isRTL = i18n.language === 'ar';
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const trainees = [
    { id: '1', name: 'Ahmed Mohammed', jobId: '2024-001' },
    { id: '2', name: 'Sara Al-Otaibi', jobId: '2024-002' },
    { id: '3', name: 'John Doe', jobId: '2024-003' },
    { id: '4', name: 'Laila Hassan', jobId: '2024-004' },
  ];

  const exportToExcel = () => {
    const tableData = trainees.map(t => ({
      'Trainee Name': t.name,
      'Job ID': t.jobId,
      ...days.reduce((acc, day) => {
        acc[format(day, 'MMM d')] = ''; // Placeholder
        return acc;
      }, {} as any)
    }));

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `Attendance_${format(currentDate, 'MMM_yyyy')}.xlsx`);
  };

  // Helper to check if it's a working day (Sun-Thu)
  const isWorkingDay = (day: Date) => {
    const dayOfWeek = day.getDay();
    // 0 is Sunday, 5 is Friday, 6 is Saturday
    // Institute: Sun(0), Mon(1), Tue(2), Wed(3), Thu(4)
    // Weekends: Fri(5), Sat(6)
    return dayOfWeek !== 5 && dayOfWeek !== 6;
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all">
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 font-bold text-gray-700 min-w-[140px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <select className="bg-white border border-gray-200 text-sm rounded-xl p-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500 font-medium">
            <option>All Specializations</option>
            <option>Web Development</option>
            <option>Cyber Security</option>
          </select>

          <select className="bg-white border border-gray-200 text-sm rounded-xl p-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500 font-medium">
            <option>React Intensive (G1)</option>
            <option>Java Enterprise (G2)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            {t('exportExcel')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            <Check size={18} />
            {t('save')} All
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-2">
        {codes.map((c) => (
          <div key={c.code} className="flex items-center gap-2">
            <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs border ${c.color}`}>
              {c.code}
            </span>
            <span className="text-xs font-medium text-gray-500 uppercase">{t(c.label.toLowerCase())}</span>
          </div>
        ))}
        <div className="ms-auto flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <Info size={14} />
          Fridays and Saturdays are disabled
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="sticky left-0 bg-gray-50 z-10 p-4 min-w-[200px] border-e border-gray-100 text-start">
                  <div className="flex items-center gap-2">
                    <Search size={16} className="text-gray-400" />
                    <input 
                      type="text" 
                      placeholder={t('searchByJobId')}
                      className="bg-transparent border-none text-xs outline-none w-full"
                    />
                  </div>
                </th>
                {days.map((day) => (
                  <th 
                    key={day.toString()} 
                    className={`p-3 text-center min-w-[45px] border-e border-gray-100 last:border-e-0 ${!isWorkingDay(day) ? 'bg-gray-100/50' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {format(day, 'EEE')}
                      </span>
                      <span className={`text-xs font-bold mt-1 ${isSameDay(day, new Date()) ? 'text-blue-600 bg-blue-50 w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
                        {format(day, 'd')}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {trainees.map((trainee) => (
                <tr key={trainee.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="sticky left-0 bg-white z-10 p-4 border-e border-gray-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{trainee.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono mt-0.5">{trainee.jobId}</span>
                    </div>
                  </td>
                  {days.map((day) => {
                    const working = isWorkingDay(day);
                    return (
                      <td 
                        key={day.toString()} 
                        className={`p-2 border-e border-gray-100 last:border-e-0 text-center ${!working ? 'bg-gray-100/30' : ''}`}
                      >
                        {working ? (
                          <div className="relative group cursor-pointer inline-block">
                            <button className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-300 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center">
                              -
                            </button>
                            {/* Hover Menu Mini */}
                            <div className="absolute top-0 start-0 z-20 hidden group-hover:flex bg-white shadow-xl rounded-lg p-1 border border-gray-100 gap-1 animate-in fade-in zoom-in duration-200">
                               {codes.map(c => (
                                 <button key={c.code} className={`w-7 h-7 rounded-md text-[10px] font-black border ${c.color} hover:scale-110 transition-transform`}>
                                   {c.code}
                                 </button>
                               ))}
                            </div>
                          </div>
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
