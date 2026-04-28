import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Calendar, 
  ClipboardCheck, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Languages,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { name: t('dashboard'), icon: BarChart3, path: '/' },
    { name: t('specializations'), icon: BookOpen, path: '/specializations' },
    { name: t('groups'), icon: Users, path: '/groups' },
    { name: t('trainees'), icon: Users, path: '/trainees' },
    { name: t('attendance'), icon: ClipboardCheck, path: '/attendance' },
    { name: t('evaluations'), icon: FileText, path: '/evaluations' },
    { name: t('reports'), icon: BarChart3, path: '/reports' },
    { name: t('settings'), icon: Settings, path: '/settings' },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 flex ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-e border-gray-200 flex flex-col sticky top-0 h-screen z-30 overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold text-blue-600 truncate"
              >
                {t('appName')}
              </motion.span>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`ms-3 font-medium whitespace-nowrap`}
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
           <button
            onClick={toggleLanguage}
            className="flex items-center w-full p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-all group"
          >
            <Languages size={22} />
            {isSidebarOpen && (
              <span className="ms-3 font-medium">{i18n.language === 'en' ? 'العربية' : 'English'}</span>
            )}
          </button>
          
          <button className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all group">
            <LogOut size={22} />
            {isSidebarOpen && <span className="ms-3 font-medium">{t('logout')}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-auto">
        <header className="h-16 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-20">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || t('dashboard')}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-end">
              <span className="text-sm font-medium text-gray-900">Haitham Hafez</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              HH
            </div>
          </div>
        </header>

        <div className="p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
