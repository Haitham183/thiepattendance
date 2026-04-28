import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Save, 
  Clock, 
  Shield, 
  UserCog, 
  Globe, 
  Mail,
  Bell,
  Lock
} from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [hours, setHours] = useState({ start: '08:00', end: '20:00' });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Operating Hours */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Clock size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Institute Operating Hours</h3>
            <p className="text-sm text-gray-500">Define the default attendance window</p>
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ms-1">Start Time (Sunday - Thursday)</label>
            <input 
              type="time" 
              value={hours.start}
              onChange={(e) => setHours({...hours, start: e.target.value})}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ms-1">End Time (Sunday - Thursday)</label>
            <input 
              type="time" 
              value={hours.end}
              onChange={(e) => setHours({...hours, end: e.target.value})}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
            />
          </div>
        </div>
      </section>

      {/* Role Management (Simplified View) */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <Shield size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">User Access Control (RBAC)</h3>
            <p className="text-sm text-gray-500">Manage instructor and supervisor permissions</p>
          </div>
        </div>
        <div className="p-8 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">I</div>
              <div>
                <p className="text-sm font-bold text-gray-800">Instructors</p>
                <p className="text-xs text-gray-500">Can view assigned groups and mark attendance</p>
              </div>
            </div>
            <button className="text-blue-600 text-sm font-bold hover:underline">Edit Privileges</button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">S</div>
              <div>
                <p className="text-sm font-bold text-gray-800">Supervisors</p>
                <p className="text-xs text-gray-500">Full CRUD on trainees, groups, and instructors</p>
              </div>
            </div>
            <button className="text-blue-600 text-sm font-bold hover:underline">Edit Privileges</button>
          </div>
        </div>
      </section>

      {/* Language & Localisation */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
            <Globe size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Language Preferences</h3>
            <p className="text-sm text-gray-500">System-wide language and RTL settings</p>
          </div>
        </div>
        <div className="p-8 flex gap-4">
          <button 
             onClick={() => i18n.changeLanguage('en')}
             className={`flex-1 p-4 rounded-2xl border-2 transition-all font-bold text-center ${i18n.language === 'en' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}
          >
            English (LTR)
          </button>
          <button 
             onClick={() => i18n.changeLanguage('ar')}
             className={`flex-1 p-4 rounded-2xl border-2 transition-all font-bold text-center ${i18n.language === 'ar' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}
          >
            العربية (RTL)
          </button>
        </div>
      </section>

      <div className="flex justify-end gap-4 p-4">
        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
          <Save size={20} />
          Save Global Settings
        </button>
      </div>
    </div>
  );
}
