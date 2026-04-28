/* =====================================================
   ACADEMIC AFFAIRS — Full EN / AR Translation Dictionary
   ===================================================== */
const i18n = {
  en: {
    // App
    appName: 'Academic Affairs', appSubtitle: 'Management System',
    // Auth
    login: 'Sign In', logout: 'Logout', username: 'Username',
    password: 'Password', loginBtn: 'Sign In', loginError: 'Invalid username or password.',
    loginWelcome: 'Welcome back!', loginDesc: 'Sign in to your account to continue.',
    // Nav
    dashboard: 'Dashboard', specializations: 'Specializations',
    groups: 'Training Groups', instructors: 'Instructors',
    trainees: 'Trainees', users: 'User Management', settings: 'Settings',
    reports: 'Reports', reportTrainee: 'Trainee Report',
    reportGroup: 'Group Report', myGroups: 'My Groups',
    attendance: 'Attendance', evaluations: 'Evaluations', holidays: 'Holidays',
    // Common
    add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save',
    cancel: 'Cancel', search: 'Search', filter: 'Filter',
    actions: 'Actions', confirm: 'Confirm', close: 'Close',
    yes: 'Yes', no: 'No', name: 'Name', nameAr: 'Arabic Name',
    nameEn: 'English Name', description: 'Description',
    createdAt: 'Created At', status: 'Status', total: 'Total',
    none: 'None', all: 'All', select: 'Select',
    month: 'Month', year: 'Year', date: 'Date',
    print: 'Print', export: 'Export to Excel',
    goBack: 'Go Back', view: 'View', manage: 'Manage',
    noData: 'No data found.', loading: 'Loading...',
    // Dashboard
    dashboardTitle: 'Dashboard', totalInstructors: 'Total Instructors',
    totalTrainees: 'Total Trainees', totalGroups: 'Active Groups',
    totalSpecializations: 'Specializations', attendanceRate: 'Attendance Rate',
    overallAttendance: 'Overall Attendance Distribution',
    groupPerformance: 'Group Performance Overview',
    recentActivity: 'Quick Stats',
    // Specializations
    addSpecialization: 'Add Specialization', editSpecialization: 'Edit Specialization',
    deleteSpecialization: 'Delete Specialization',
    specializationName: 'Specialization Name (EN)', specializationNameAr: 'Specialization Name (AR)',
    deleteSpecConfirm: 'Are you sure you want to delete this specialization? This action cannot be undone.',
    // Groups
    addGroup: 'Add Group', editGroup: 'Edit Group', deleteGroup: 'Delete Group',
    groupName: 'Group Name', specialization: 'Specialization',
    startDate: 'Start Date', endDate: 'End Date',
    schedule: 'Schedule', addScheduleSlot: 'Add Schedule Slot',
    day: 'Day', startTime: 'Start Time', endTime: 'End Time',
    assignedInstructors: 'Assigned Instructors',
    traineeCount: 'Trainees', deleteGroupConfirm: 'Delete this group?',
    dailyStartTime: 'Daily Start Time', dailyEndTime: 'Daily End Time',
    // Instructors
    addInstructor: 'Add Instructor', editInstructor: 'Edit Instructor',
    deleteInstructor: 'Delete Instructor', fullName: 'Full Name',
    email: 'Email', phone: 'Phone', loginCredentials: 'Login Credentials',
    createUser: 'Create User Account', userCreated: 'User account created.',
    deleteInstrConfirm: 'Delete this instructor?',
    // Trainees
    addTrainee: 'Add Trainee', editTrainee: 'Edit Trainee',
    deleteTrainee: 'Delete Trainee', jobId: 'Job ID',
    companyName: 'Company Name', mobile: 'Mobile Number',
    enrollmentStart: 'Enrollment Start', enrollmentEnd: 'Enrollment End',
    group: 'Group', deleteTraineeConfirm: 'Delete this trainee?',
    jobIdExists: 'A trainee with this Job ID already exists.',
    // Attendance
    attendanceSheet: 'Monthly Attendance Sheet',
    selectMonth: 'Select Month', selectYear: 'Select Year',
    selectGroup: 'Select Group', markAll: 'Mark All Present',
    clearAll: 'Clear All', saveAttendance: 'Save Attendance',
    attendanceSaved: 'Attendance saved successfully.',
    statusPresent: 'Present (P)', statusAbsent: 'Absent (A)',
    statusExcused: 'Excused (E)', statusHalf: 'Half Day (H)',
    statusLate: 'Late (L)', weekend: 'Weekend',
    // Evaluations
    evaluationsTitle: 'Monthly Evaluations',
    score1: 'Score 1', score2: 'Score 2',
    totalScore: 'Total %', grade: 'Grade',
    saveEvaluations: 'Save Evaluations',
    evaluationsSaved: 'Evaluations saved successfully.',
    gradeExcellent: 'Excellent', gradeVeryGood: 'Very Good',
    gradeGood: 'Good', gradePoor: 'Poor',
    // Reports
    traineeReportTitle: 'Trainee Report',
    searchByJobId: 'Search by Job ID', generateReport: 'Generate Report',
    attendanceSummary: 'Attendance Summary', evaluationHistory: 'Evaluation History',
    groupReportTitle: 'Group Report', attendanceBreakdown: 'Attendance Breakdown',
    presentDays: 'Present', absentDays: 'Absent', excusedDays: 'Excused',
    halfDays: 'Half Day', lateDays: 'Late', workingDays: 'Working Days',
    attendancePct: 'Attendance %',
    // Users
    addUser: 'Add User', editUser: 'Edit User', deleteUser: 'Delete User',
    role: 'Role', roleAdmin: 'Admin', roleInstructor: 'Instructor',
    roleSupervisor: 'Supervisor', permissions: 'Permissions',
    permAddTrainees: 'Add Trainees', permRemoveTrainees: 'Remove Trainees',
    permAddGroups: 'Add Groups', permRemoveGroups: 'Remove Groups',
    permAddSpecializations: 'Add Specializations',
    permRemoveSpecializations: 'Remove Specializations',
    permViewReports: 'View Reports', permExport: 'Export Data',
    linkInstructor: 'Link to Instructor Profile',
    newPassword: 'New Password', confirmPassword: 'Confirm Password',
    passwordMismatch: 'Passwords do not match.',
    deleteUserConfirm: 'Delete this user?',
    // Settings
    settingsTitle: 'System Settings', workingHours: 'Working Hours',
    workingHoursStart: 'Start Time', workingHoursEnd: 'End Time',
    language: 'Language', languageEn: 'English', languageAr: 'Arabic',
    saveSettings: 'Save Settings', settingsSaved: 'Settings saved.',
    systemInfo: 'System Information', version: 'Version',
    // Days
    sunday: 'Sun', monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
    thursday: 'Thu', friday: 'Fri', saturday: 'Sat',
    sundayFull: 'Sunday', mondayFull: 'Monday', tuesdayFull: 'Tuesday',
    wednesdayFull: 'Wednesday', thursdayFull: 'Thursday',
    fridayFull: 'Friday', saturdayFull: 'Saturday',
    // Months
    jan:'January',feb:'February',mar:'March',apr:'April',
    may:'May',jun:'June',jul:'July',aug:'August',
    sep:'September',oct:'October',nov:'November',dec:'December',
    // Messages
    saved: 'Saved successfully.', deleted: 'Deleted successfully.',
    error: 'An error occurred. Please try again.',
    confirmDelete: 'Are you sure you want to delete this item?',
    required: 'This field is required.',
    accessDenied: 'Access denied. Insufficient permissions.',
    addHoliday: 'Add Exceptional Holiday', holidayDate: 'Holiday Date',
    holidayReason: 'Reason / Occasion', deleteHolidayConfirm: 'Delete this holiday?',
    period1: 'Period 1', period2: 'Period 2',
    clearAllConfirm: 'Are you sure you want to clear all attendance for this month?',
    cleared: 'Data cleared successfully.',
    instructor1: 'Instructor 1', instructor2: 'Instructor 2',
    sessionStartTime: 'Session Start', sessionEndTime: 'Session End',
  },
  ar: {
    // App
    appName: 'الشؤون الأكاديمية', appSubtitle: 'نظام الإدارة',
    // Auth
    login: 'تسجيل الدخول', logout: 'تسجيل الخروج',
    username: 'اسم المستخدم', password: 'كلمة المرور',
    loginBtn: 'دخول', loginError: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
    loginWelcome: '!أهلاً بعودتك', loginDesc: 'سجل دخولك للمتابعة.',
    // Nav
    dashboard: 'لوحة التحكم', specializations: 'التخصصات',
    groups: 'مجموعات التدريب', instructors: 'المدربون',
    trainees: 'المتدربون', users: 'إدارة المستخدمين',
    settings: 'الإعدادات', reports: 'التقارير',
    reportTrainee: 'تقرير متدرب', reportGroup: 'تقرير مجموعة',
    myGroups: 'مجموعاتي', attendance: 'الحضور والغياب',
    evaluations: 'التقييمات الشهرية', holidays: 'العطلات الاستثنائية',
    // Common
    add: 'إضافة', edit: 'تعديل', delete: 'حذف', save: 'حفظ',
    cancel: 'إلغاء', search: 'بحث', filter: 'تصفية',
    actions: 'الإجراءات', confirm: 'تأكيد', close: 'إغلاق',
    yes: 'نعم', no: 'لا', name: 'الاسم', nameAr: 'الاسم بالعربية',
    nameEn: 'الاسم بالإنجليزية', description: 'الوصف',
    createdAt: 'تاريخ الإنشاء', status: 'الحالة', total: 'المجموع',
    none: 'لا يوجد', all: 'الكل', select: 'اختر',
    month: 'الشهر', year: 'السنة', date: 'التاريخ',
    print: 'طباعة', export: 'تصدير إلى Excel',
    goBack: 'رجوع', view: 'عرض', manage: 'إدارة',
    noData: 'لا توجد بيانات.', loading: 'جارٍ التحميل...',
    // Dashboard
    dashboardTitle: 'لوحة التحكم', totalInstructors: 'إجمالي المدربين',
    totalTrainees: 'إجمالي المتدربين', totalGroups: 'المجموعات النشطة',
    totalSpecializations: 'التخصصات', attendanceRate: 'نسبة الحضور',
    overallAttendance: 'توزيع الحضور الإجمالي',
    groupPerformance: 'نظرة عامة على أداء المجموعات',
    recentActivity: 'إحصائيات سريعة',
    // Specializations
    addSpecialization: 'إضافة تخصص', editSpecialization: 'تعديل تخصص',
    deleteSpecialization: 'حذف تخصص',
    specializationName: 'اسم التخصص (إنجليزي)', specializationNameAr: 'اسم التخصص (عربي)',
    deleteSpecConfirm: 'هل أنت متأكد من حذف هذا التخصص؟',
    // Groups
    addGroup: 'إضافة مجموعة', editGroup: 'تعديل مجموعة',
    deleteGroup: 'حذف مجموعة', groupName: 'اسم المجموعة',
    specialization: 'التخصص', startDate: 'تاريخ البدء',
    endDate: 'تاريخ الانتهاء', schedule: 'جدول المواعيد',
    addScheduleSlot: 'إضافة موعد', day: 'اليوم',
    startTime: 'وقت البدء', endTime: 'وقت الانتهاء',
    assignedInstructors: 'المدربون المعينون',
    traineeCount: 'المتدربون', deleteGroupConfirm: 'حذف هذه المجموعة؟',
    dailyStartTime: 'وقت البدء اليومي', dailyEndTime: 'وقت الانتهاء اليومي',
    // Instructors
    addInstructor: 'إضافة مدرب', editInstructor: 'تعديل مدرب',
    deleteInstructor: 'حذف مدرب', fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني', phone: 'رقم الهاتف',
    loginCredentials: 'بيانات تسجيل الدخول', createUser: 'إنشاء حساب مستخدم',
    userCreated: 'تم إنشاء الحساب.', deleteInstrConfirm: 'حذف هذا المدرب؟',
    // Trainees
    addTrainee: 'إضافة متدرب', editTrainee: 'تعديل متدرب',
    deleteTrainee: 'حذف متدرب', jobId: 'الرقم الوظيفي',
    companyName: 'اسم الشركة', mobile: 'رقم الجوال',
    enrollmentStart: 'تاريخ بدء التسجيل', enrollmentEnd: 'تاريخ انتهاء التسجيل',
    group: 'المجموعة', deleteTraineeConfirm: 'حذف هذا المتدرب؟',
    jobIdExists: 'يوجد متدرب بنفس الرقم الوظيفي مسبقاً.',
    // Attendance
    attendanceSheet: 'كشف الحضور الشهري', selectMonth: 'اختر الشهر',
    selectYear: 'اختر السنة', selectGroup: 'اختر المجموعة',
    markAll: 'تحديد الكل حاضر', clearAll: 'مسح الكل',
    saveAttendance: 'حفظ الحضور', attendanceSaved: 'تم حفظ الحضور بنجاح.',
    statusPresent: 'حاضر (P)', statusAbsent: 'غائب (A)',
    statusExcused: 'بعذر (E)', statusHalf: 'نصف يوم (H)',
    statusLate: 'متأخر (L)', weekend: 'عطلة',
    // Evaluations
    evaluationsTitle: 'التقييمات الشهرية',
    score1: 'الدرجة 1', score2: 'الدرجة 2',
    totalScore: 'المجموع %', grade: 'التقدير',
    saveEvaluations: 'حفظ التقييمات',
    evaluationsSaved: 'تم حفظ التقييمات بنجاح.',
    gradeExcellent: 'ممتاز', gradeVeryGood: 'جيد جداً',
    gradeGood: 'جيد', gradePoor: 'ضعيف',
    // Reports
    traineeReportTitle: 'تقرير المتدرب',
    searchByJobId: 'بحث بالرقم الوظيفي', generateReport: 'إنشاء التقرير',
    attendanceSummary: 'ملخص الحضور', evaluationHistory: 'سجل التقييمات',
    groupReportTitle: 'تقرير المجموعة', attendanceBreakdown: 'توزيع الحضور',
    presentDays: 'حاضر', absentDays: 'غائب', excusedDays: 'بعذر',
    halfDays: 'نصف يوم', lateDays: 'متأخر', workingDays: 'أيام العمل',
    attendancePct: 'نسبة الحضور %',
    // Users
    addUser: 'إضافة مستخدم', editUser: 'تعديل مستخدم',
    deleteUser: 'حذف مستخدم', role: 'الدور',
    roleAdmin: 'مدير', roleInstructor: 'مدرب', roleSupervisor: 'مشرف',
    permissions: 'الصلاحيات', permAddTrainees: 'إضافة متدربين',
    permRemoveTrainees: 'حذف متدربين', permAddGroups: 'إضافة مجموعات',
    permRemoveGroups: 'حذف مجموعات', permAddSpecializations: 'إضافة تخصصات',
    permRemoveSpecializations: 'حذف تخصصات', permViewReports: 'عرض التقارير',
    permExport: 'تصدير البيانات', linkInstructor: 'ربط بملف مدرب',
    newPassword: 'كلمة المرور الجديدة', confirmPassword: 'تأكيد كلمة المرور',
    passwordMismatch: 'كلمتا المرور غير متطابقتين.',
    deleteUserConfirm: 'حذف هذا المستخدم؟',
    // Settings
    settingsTitle: 'إعدادات النظام', workingHours: 'ساعات العمل',
    workingHoursStart: 'وقت البدء', workingHoursEnd: 'وقت الانتهاء',
    language: 'اللغة', languageEn: 'الإنجليزية', languageAr: 'العربية',
    saveSettings: 'حفظ الإعدادات', settingsSaved: 'تم حفظ الإعدادات.',
    systemInfo: 'معلومات النظام', version: 'الإصدار',
    // Days
    sunday:'أحد',monday:'إثنين',tuesday:'ثلاثاء',wednesday:'أربعاء',thursday:'خميس',
    friday:'جمعة',saturday:'سبت',
    sundayFull:'الأحد',mondayFull:'الاثنين',tuesdayFull:'الثلاثاء',
    wednesdayFull:'الأربعاء',thursdayFull:'الخميس',
    fridayFull:'الجمعة',saturdayFull:'السبت',
    // Months
    jan:'يناير',feb:'فبراير',mar:'مارس',apr:'أبريل',
    may:'مايو',jun:'يونيو',jul:'يوليو',aug:'أغسطس',
    sep:'سبتمبر',oct:'أكتوبر',nov:'نوفمبر',dec:'ديسمبر',
    // Messages
    saved:'تم الحفظ بنجاح.',deleted:'تم الحذف بنجاح.',
    error:'حدث خطأ، يرجى المحاولة مرة أخرى.',
    confirmDelete:'هل أنت متأكد من حذف هذا العنصر؟',
    required:'هذا الحقل مطلوب.',
    accessDenied:'رفض الوصول. صلاحيات غير كافية.',
    addHoliday: 'إضافة عطلة استثنائية', holidayDate: 'تاريخ العطلة',
    holidayReason: 'السبب / المناسبة', deleteHolidayConfirm: 'حذف هذه العطلة؟',
    period1: 'الفترة الأولى', period2: 'الفترة الثانية',
    clearAllConfirm: 'هل أنت متأكد من مسح جميع بيانات التحضير لهذا الشهر؟',
    cleared: 'تم مسح البيانات بنجاح.',
    instructor1: 'مدرب الفترة الأولى', instructor2: 'مدرب الفترة الثانية',
    sessionStartTime: 'بداية الفترة', sessionEndTime: 'نهاية الفترة',
  }
};

// ---- Current language state ----
let currentLang = localStorage.getItem('aa_lang') || 'en';

function t(key) {
  return (i18n[currentLang] && i18n[currentLang][key]) || (i18n.en[key]) || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('aa_lang', lang);
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  // Re-render UI text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (key) el.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.title = t(key);
  });
}

function applyLang() { setLang(currentLang); }

// Month names array
function monthName(index) {
  const keys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  return t(keys[index]);
}

// Day short names (Sun=0 … Sat=6)
function dayName(dayIndex) {
  const keys = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  return t(keys[dayIndex]);
}
