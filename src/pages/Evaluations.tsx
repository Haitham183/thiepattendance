import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Download, 
  Save, 
  Calculator,
  Award,
  AlertCircle
} from 'lucide-react';

const getGrade = (score: number) => {
  if (score >= 90) return { label: 'Excellent', color: 'text-green-600 bg-green-100 border-green-200' };
  if (score >= 80) return { label: 'Very Good', color: 'text-blue-600 bg-blue-100 border-blue-200' };
  if (score >= 70) return { label: 'Good', color: 'text-orange-600 bg-orange-100 border-orange-200' };
  return { label: 'Poor', color: 'text-red-600 bg-red-100 border-red-200' };
};

export default function Evaluations() {
  const { t } = useTranslation();
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const trainees = [
    { id: '1', name: 'Ahmed Mohammed', jobId: '2024-001', score1: 85, score2: 92 },
    { id: '2', name: 'Sara Al-Otaibi', jobId: '2024-002', score1: 72, score2: 68 },
    { id: '3', name: 'John Doe', jobId: '2024-003', score1: 95, score2: 98 },
    { id: '4', name: 'Laila Hassan', jobId: '2024-004', score1: 80, score2: 75 },
  ];

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase mb-1">Target Month</span>
            <select 
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 text-sm rounded-xl p-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase mb-1">Group</span>
            <select className="bg-white border border-gray-200 text-sm rounded-xl p-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500 font-medium">
              <option>React Intensive (G1)</option>
              <option>Java Enterprise (G2)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <Save size={18} />
            {t('save')} Evaluation
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-start">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase">Trainee Details</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase text-center">Score 1 (50%)</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase text-center">Score 2 (50%)</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase text-center">Average</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase text-center">Grade Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {trainees.map((trainee) => {
              const avg = (trainee.score1 + trainee.score2) / 2;
              const grade = getGrade(avg);
              
              return (
                <tr key={trainee.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{trainee.name}</span>
                      <span className="text-xs text-gray-400 font-mono">{trainee.jobId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <input 
                        type="number" 
                        defaultValue={trainee.score1}
                        className="w-16 h-10 text-center bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <input 
                        type="number" 
                        defaultValue={trainee.score2}
                        className="w-16 h-10 text-center bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-black text-gray-900">{avg}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider ${grade.color}`}>
                        {grade.label}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Calculator size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900">Grading Logic</h4>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Grades are calculated as the arithmetic mean of two monthly assessment scores. 
            Levels: Excellent (≥90), Very Good (80-89), Good (70-79), Poor (&lt;70).
            Attendance records impact the overall final certification eligibility.
          </p>
        </div>
      </div>
    </div>
  );
}
