import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users, Calendar, Clock, UserCheck } from 'lucide-react';

export default function Groups() {
  const { t } = useTranslation();

  const groups = [
    { 
      id: '1', 
      name: 'React Intensive (G1)', 
      instructor: 'Dr. Sarah Wilson',
      specialization: 'Web Development',
      schedule: 'Sun - Thu • 08:00 - 12:00',
      trainees: 22,
      status: 'active'
    },
    { 
      id: '2', 
      name: 'Cyber Shield (G1)', 
      instructor: 'Eng. Khaled Ahmed',
      specialization: 'Cyber Security',
      schedule: 'Sun - Thu • 14:00 - 18:00',
      trainees: 18,
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Training {t('groups')} & cohorts</h3>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <Plus size={18} />
          Create New Group
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map(group => (
          <div key={group.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
            <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center shrink-0 ${group.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
               <span className="text-2xl font-black">{group.trainees}</span>
               <span className="text-[10px] font-bold uppercase">Trainees</span>
            </div>

            <div className="flex-1 space-y-4">
               <div>
                  <div className="flex items-center justify-between">
                     <h4 className="text-lg font-bold text-gray-900">{group.name}</h4>
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${group.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                        {group.status}
                     </span>
                  </div>
                  <p className="text-xs font-semibold text-blue-500 mt-0.5">{group.specialization}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-500">
                     <UserCheck size={16} />
                     <span className="text-xs font-medium">{group.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                     <Clock size={16} />
                     <span className="text-xs font-medium">{group.schedule}</span>
                  </div>
               </div>

               <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                     View Trainees
                  </button>
                  <button className="flex-1 py-2 text-sm font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                     Edit Group
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
