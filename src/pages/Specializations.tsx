import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, BookOpen, Layers } from 'lucide-react';

export default function Specializations() {
  const { t } = useTranslation();
  
  const specs = [
    { id: '1', nameEn: 'Web Development', nameAr: 'تطوير الويب', trainees: 45, groups: 3 },
    { id: '2', nameEn: 'Cyber Security', nameAr: 'الأمن السيبراني', trainees: 32, groups: 2 },
    { id: '3', nameEn: 'Data Science', nameAr: 'علم البيانات', trainees: 28, groups: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Manage {t('specializations')}</h3>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <Plus size={18} />
          {t('add')} Specialization
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specs.map(spec => (
          <div key={spec.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BookOpen size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16}/></button>
                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
              </div>
            </div>
            
            <h4 className="text-lg font-bold text-gray-900 mb-1">{spec.nameEn}</h4>
            <h5 className="text-sm font-medium text-gray-400 mb-6">{spec.nameAr}</h5>
            
            <div className="flex gap-4 pt-6 border-t border-gray-50">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Trainees</span>
                  <span className="text-sm font-bold text-gray-800">{spec.trainees}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Groups</span>
                  <span className="text-sm font-bold text-gray-800">{spec.groups}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
