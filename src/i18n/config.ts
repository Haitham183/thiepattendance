import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      appName: "AcademiaSync",
      dashboard: "Dashboard",
      academicSetup: "Academic Setup",
      specializations: "Specializations",
      groups: "Groups",
      instructors: "Instructors",
      trainees: "Trainees",
      attendance: "Attendance",
      evaluations: "Evaluations",
      reports: "Reports",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
      register: "Register",
      totalInstructors: "Total Instructors",
      attendanceRate: "Attendance Rate",
      activeGroups: "Active Groups",
      performanceLevel: "Performance Level",
      searchByJobId: "Search by Job ID",
      exportExcel: "Export to Excel",
      printReport: "Print Report",
      fullName: "Full Name",
      jobId: "Job ID",
      companyName: "Company Name",
      mobile: "Mobile",
      email: "Email",
      startDate: "Start Date",
      endDate: "End Date",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      add: "Add New",
      p: "Present",
      a: "Absent",
      e: "Excused",
      h: "Half Day",
      l: "Late",
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
    }
  },
  ar: {
    translation: {
      appName: "أكاديميا سينك",
      dashboard: "لوحة التحكم",
      academicSetup: "الإعداد الأكاديمي",
      specializations: "التخصصات",
      groups: "المجموعات",
      instructors: "المدربون",
      trainees: "المتدربون",
      attendance: "التحضير",
      evaluations: "التقييمات",
      reports: "التقارير",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      login: "تسجيل الدخول",
      register: "تسجيل",
      totalInstructors: "إجمالي المدربين",
      attendanceRate: "نسبة الحضور",
      activeGroups: "المجموعات النشطة",
      performanceLevel: "مستوى الأداء",
      searchByJobId: "البحث برقم الوظيفة",
      exportExcel: "تصدير للاكسل",
      printReport: "طباعة التقرير",
      fullName: "الاسم الكامل",
      jobId: "رقم الوظيفة",
      companyName: "اسم الشركة",
      mobile: "الجوال",
      email: "البريد الإلكتروني",
      startDate: "تاريخ البدء",
      endDate: "تاريخ الانتهاء",
      save: "حفظ",
      cancel: "إلغاء",
      edit: "تعديل",
      delete: "حذف",
      add: "إضافة جديد",
      p: "حاضر",
      a: "غائب",
      e: "بعذر",
      h: "نصف يوم",
      l: "متأخر",
      sunday: "الأحد",
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
