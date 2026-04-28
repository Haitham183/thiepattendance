/* =====================================================
   ACADEMIC AFFAIRS — Data Layer (localStorage CRUD)
   ===================================================== */

const DB = {
  KEYS: {
    users: 'aa_users', specializations: 'aa_specs', groups: 'aa_groups',
    instructors: 'aa_instructors', trainees: 'aa_trainees',
    attendance: 'aa_attendance', evaluations: 'aa_evaluations',
    settings: 'aa_settings', holidays: 'aa_holidays',
  },

  // ---- Helpers ----
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },
  now() { return new Date().toISOString(); },

  load(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  save(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); return true; }
    catch { return false; }
  },

  // ---- Settings ----
  getSettings() {
    return this.load(this.KEYS.settings) || {
      workingHoursStart: '08:00', workingHoursEnd: '20:00',
      version: '2.0.0',
    };
  },
  saveSettings(data) { return this.save(this.KEYS.settings, data); },

  // ---- Users ----
  getUsers() { return this.load(this.KEYS.users) || []; },
  getUserById(id) { return this.getUsers().find(u => u.id === id) || null; },
  getUserByUsername(username) {
    return this.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  },
  addUser(data) {
    const users = this.getUsers();
    const user = { id: this.uid(), createdAt: this.now(), ...data };
    users.push(user);
    this.save(this.KEYS.users, users);
    return user;
  },
  updateUser(id, data) {
    const users = this.getUsers().map(u => u.id === id ? { ...u, ...data } : u);
    this.save(this.KEYS.users, users);
    return users.find(u => u.id === id);
  },
  deleteUser(id) {
    const users = this.getUsers().filter(u => u.id !== id);
    this.save(this.KEYS.users, users);
  },

  // ---- Specializations ----
  getSpecializations() { return this.load(this.KEYS.specializations) || []; },
  getSpecById(id) { return this.getSpecializations().find(s => s.id === id) || null; },
  addSpec(data) {
    const list = this.getSpecializations();
    const item = { id: this.uid(), createdAt: this.now(), ...data };
    list.push(item);
    this.save(this.KEYS.specializations, list);
    return item;
  },
  updateSpec(id, data) {
    const list = this.getSpecializations().map(s => s.id === id ? { ...s, ...data } : s);
    this.save(this.KEYS.specializations, list);
    return list.find(s => s.id === id);
  },
  deleteSpec(id) {
    const list = this.getSpecializations().filter(s => s.id !== id);
    this.save(this.KEYS.specializations, list);
  },

  // ---- Groups ----
  getGroups() { return this.load(this.KEYS.groups) || []; },
  getGroupById(id) { return this.getGroups().find(g => g.id === id) || null; },
  getGroupsBySpec(specId) { return this.getGroups().filter(g => g.specializationId === specId); },
  addGroup(data) {
    const list = this.getGroups();
    const item = { id: this.uid(), createdAt: this.now(), instructorIds: [], startTime: '08:00', endTime: '16:00', ...data };
    list.push(item);
    this.save(this.KEYS.groups, list);
    return item;
  },
  updateGroup(id, data) {
    const list = this.getGroups().map(g => g.id === id ? { ...g, ...data } : g);
    this.save(this.KEYS.groups, list);
    return list.find(g => g.id === id);
  },
  deleteGroup(id) {
    this.save(this.KEYS.groups, this.getGroups().filter(g => g.id !== id));
  },

  // ---- Instructors ----
  getInstructors() { return this.load(this.KEYS.instructors) || []; },
  getInstructorById(id) { return this.getInstructors().find(i => i.id === id) || null; },
  getInstructorByUserId(userId) { return this.getInstructors().find(i => i.userId === userId) || null; },
  addInstructor(data) {
    const list = this.getInstructors();
    const item = { id: this.uid(), createdAt: this.now(), ...data };
    list.push(item);
    this.save(this.KEYS.instructors, list);
    return item;
  },
  updateInstructor(id, data) {
    const list = this.getInstructors().map(i => i.id === id ? { ...i, ...data } : i);
    this.save(this.KEYS.instructors, list);
    return list.find(i => i.id === id);
  },
  deleteInstructor(id) {
    this.save(this.KEYS.instructors, this.getInstructors().filter(i => i.id !== id));
  },
  getGroupsForInstructor(instructorId) {
    return this.getGroups().filter(g =>
      Array.isArray(g.instructorIds) && g.instructorIds.includes(instructorId)
    );
  },

  // ---- Trainees ----
  getTrainees() { return this.load(this.KEYS.trainees) || []; },
  getTraineeById(id) { return this.getTrainees().find(t => t.id === id) || null; },
  getTraineeByJobId(jobId) {
    return this.getTrainees().find(t => t.jobId.toLowerCase() === jobId.toLowerCase()) || null;
  },
  getTraineesByGroup(groupId) { return this.getTrainees().filter(t => t.groupId === groupId); },
  addTrainee(data) {
    const list = this.getTrainees();
    const item = { id: this.uid(), createdAt: this.now(), ...data };
    list.push(item);
    this.save(this.KEYS.trainees, list);
    return item;
  },
  updateTrainee(id, data) {
    const list = this.getTrainees().map(t => t.id === id ? { ...t, ...data } : t);
    this.save(this.KEYS.trainees, list);
    return list.find(t => t.id === id);
  },
  deleteTrainee(id) {
    this.save(this.KEYS.trainees, this.getTrainees().filter(t => t.id !== id));
  },

  // ---- Holidays ----
  getHolidays() { return this.load(this.KEYS.holidays) || []; },
  addHoliday(data) {
    const list = this.getHolidays();
    const item = { id: this.uid(), createdAt: this.now(), ...data };
    list.push(item);
    this.save(this.KEYS.holidays, list);
    return item;
  },
  deleteHoliday(id) {
    this.save(this.KEYS.holidays, this.getHolidays().filter(h => h.id !== id));
  },
  isHoliday(date) {
    return this.getHolidays().some(h => h.date === date);
  },

  // ---- Attendance ----
  getAttendance() { return this.load(this.KEYS.attendance) || []; },
  getAttendanceForGroup(groupId, yearMonth) {
    // yearMonth = 'YYYY-MM'
    return this.getAttendance().filter(a =>
      a.groupId === groupId && a.date.startsWith(yearMonth)
    );
  },
  getAttendanceForTrainee(traineeId) {
    return this.getAttendance().filter(a => a.traineeId === traineeId);
  },
  upsertAttendance(groupId, traineeId, date, status, period) {
    let list = this.getAttendance();
    const idx = list.findIndex(a => a.traineeId === traineeId && a.date === date && a.period === period);
    if (status === '') {
      if (idx > -1) list.splice(idx, 1);
    } else {
      if (idx > -1) { list[idx].status = status; }
      else { list.push({ id: this.uid(), groupId, traineeId, date, status, period }); }
    }
    this.save(this.KEYS.attendance, list);
  },
  bulkUpsertAttendance(records) {
    // records: [{groupId, traineeId, date, status, period}]
    let list = this.getAttendance();
    records.forEach(r => {
      const idx = list.findIndex(a => a.traineeId === r.traineeId && a.date === r.date && a.period === r.period);
      if (r.status === '') {
        if (idx > -1) list.splice(idx, 1);
      } else {
        if (idx > -1) { list[idx].status = r.status; }
        else { list.push({ id: this.uid(), ...r }); }
      }
    });
    this.save(this.KEYS.attendance, list);
  },

  // ---- Evaluations ----
  getEvaluations() { return this.load(this.KEYS.evaluations) || []; },
  getEvalForGroup(groupId, yearMonth) {
    return this.getEvaluations().filter(e => e.groupId === groupId && e.month === yearMonth);
  },
  getEvalForTrainee(traineeId) { return this.getEvaluations().filter(e => e.traineeId === traineeId); },
  calcGrade(total) {
    if (total >= 85) return 'Excellent';
    if (total >= 65) return 'VeryGood';
    if (total >= 50) return 'Good';
    return 'Poor';
  },
  upsertEvaluation(groupId, traineeId, month, score1, score2, instructorId) {
    let list = this.getEvaluations();
    const s1 = parseFloat(score1) || 0;
    const s2 = parseFloat(score2) || 0;
    const total = Math.round((s1 + s2) / 2 * 10) / 10;
    const grade = this.calcGrade(total);
    const idx = list.findIndex(e => e.traineeId === traineeId && e.month === month && e.groupId === groupId && e.instructorId === instructorId);
    if (idx > -1) {
      list[idx] = { ...list[idx], score1: s1, score2: s2, total, grade };
    } else {
      list.push({ id: this.uid(), groupId, traineeId, month, score1: s1, score2: s2, total, grade, instructorId });
    }
    this.save(this.KEYS.evaluations, list);
    return { score1: s1, score2: s2, total, grade };
  },

  // ---- Seed (initial data) ----
  seed() {
    if (this.load('aa_seeded')) return;
    // Admin user (password: admin123)
    this.addUser({
      username: 'admin', passwordHash: btoa('admin123'),
      role: 'admin',
      permissions: {
        addTrainees:true, removeTrainees:true, addGroups:true, removeGroups:true,
        addSpecializations:true, removeSpecializations:true, viewReports:true, export:true,
      },
      displayName: 'Administrator',
    });
    // Sample specializations
    const s1 = this.addSpec({ nameEn: 'Information Technology', nameAr: 'تقنية المعلومات', description: 'IT and programming courses' });
    const s2 = this.addSpec({ nameEn: 'Cybersecurity', nameAr: 'الأمن السيبراني', description: 'Network security and ethical hacking' });
    const s3 = this.addSpec({ nameEn: 'Data Science', nameAr: 'علم البيانات', description: 'Data analysis and machine learning' });
    // Sample instructor user
    const iUser = this.addUser({
      username: 'instructor1', passwordHash: btoa('inst123'),
      role: 'instructor',
      permissions: { viewReports: true },
      displayName: 'Ahmed Al-Rashidi',
    });
    const instr = this.addInstructor({
      fullName: 'Ahmed Al-Rashidi', email: 'ahmed@institute.sa',
      phone: '0501234567', specializationId: s1.id, userId: iUser.id,
    });
    this.updateUser(iUser.id, { instructorId: instr.id });
    // Sample groups
    const g1 = this.addGroup({
      name: 'IT-2024-A', specializationId: s1.id,
      startDate: '2024-01-15', endDate: '2026-12-31',
      startTime: '08:00', endTime: '12:00',
      instructorIds: [instr.id],
    });
    const g2 = this.addGroup({
      name: 'CY-2024-B', specializationId: s2.id,
      startDate: '2024-02-01', endDate: '2026-12-31',
      startTime: '13:00', endTime: '17:00',
      instructorIds: [],
    });
    // Sample trainees
    const traineeData = [
      { fullName: 'Mohammed Al-Zahrani', jobId: 'EMP001', companyName: 'Saudi Aramco', mobile: '0551234567', email: 'moh@aramco.com' },
      { fullName: 'Sara Al-Otaibi', jobId: 'EMP002', companyName: 'SABIC', mobile: '0562345678', email: 'sara@sabic.com' },
      { fullName: 'Khalid Al-Ghamdi', jobId: 'EMP003', companyName: 'STC', mobile: '0573456789', email: 'khalid@stc.com' },
      { fullName: 'Fatima Al-Shehri', jobId: 'EMP004', companyName: 'Saudi Aramco', mobile: '0584567890', email: 'fatima@aramco.com' },
    ];
    traineeData.forEach(td => this.addTrainee({ ...td, groupId: g1.id, enrollmentStart: '2024-01-15', enrollmentEnd: '2026-12-31' }));
    const t5 = this.addTrainee({ fullName: 'Omar Al-Harbi', jobId: 'EMP005', companyName: 'STC', mobile: '0595678901', email: 'omar@stc.com', groupId: g2.id, enrollmentStart: '2024-02-01', enrollmentEnd: '2026-12-31' });

    // Seed some attendance for April 2026
    const allTrainees = this.getTrainees();
    const dates = ['2026-04-05','2026-04-06','2026-04-07','2026-04-08','2026-04-09'];
    allTrainees.forEach(tr => {
      dates.forEach(d => {
        const status = Math.random() > 0.15 ? 'P' : (Math.random() > 0.5 ? 'A' : 'E');
        this.upsertAttendance(tr.groupId, tr.id, d, status);
      });
      // Seed evaluations for April 2026
      this.upsertEvaluation(tr.groupId, tr.id, '2026-04', 70 + Math.random()*30, 70 + Math.random()*30);
    });

    // Sample holidays
    this.addHoliday({ date: '2026-04-23', reason: 'Eid Al-Fitr' });
    this.addHoliday({ date: '2026-04-30', reason: 'Spring Break' });

    localStorage.setItem('aa_seeded', '1');
  },
};
