import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Building2,
  Mail,
  Phone,
  Calendar,
  X
} from 'lucide-react';

export default function Trainees() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const trainees = [
    { 
      id: '1', 
      fullName: 'Ahmed Mohammed', 
      jobId: '2024-001', 
      companyName: 'Aramco',
      specialization: 'Web Development',
      group: 'React G1',
      mobile: '+966 50 123 4567',
      email: 'ahmed@example.com',
      enrollmentStart: '2024-01-01',
      enrollmentEnd: '2024-06-30'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder={t('searchByJobId')}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} />
          {t('add')} {t('trainees')}
        </button>
      </div>

      {/* Trainees Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {trainees.map((trainee) => (
          <div key={trainee.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
            <button className="absolute top-6 right-6 p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
              <MoreVertical size={18} />
            </button>

            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black">
                {trainee.fullName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{trainee.fullName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                    ID: {trainee.jobId}
                  </span>
                  <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                    {trainee.specialization}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="p-2 bg-gray-50 rounded-lg"><Building2 size={16} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Company</span>
                  <span className="text-sm font-medium">{trainee.companyName}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <div className="p-2 bg-gray-50 rounded-lg"><Phone size={16} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Mobile</span>
                  <span className="text-sm font-medium">{trainee.mobile}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <div className="p-2 bg-gray-50 rounded-lg"><Mail size={16} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Email</span>
                  <span className="text-sm font-medium truncate max-w-[120px]">{trainee.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <div className="p-2 bg-gray-50 rounded-lg"><Calendar size={16} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Group</span>
                  <span className="text-sm font-medium">{trainee.group}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Enrollment Period</span>
                <span className="text-xs font-semibold text-gray-600 mt-1">
                  {trainee.enrollmentStart} — {trainee.enrollmentEnd}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  <Edit2 size={18} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simplified Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-60 overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-800">Enroll New Trainee</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                id="close-modal"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ms-1">Full Name</label>
                <input type="text" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ms-1">Job ID</label>
                <input type="text" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ms-1">Company Name</label>
                <input type="text" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ms-1">Group Assignment</label>
                <select className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                  <option>Select Group</option>
                  <option>React Intensive (G1)</option>
                </select>
              </div>
            </div>

            <div className="p-8 bg-gray-50 flex items-center justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700">Cancel</button>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                Complete Enrollment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
