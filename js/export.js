/* =====================================================
   ACADEMIC AFFAIRS — Excel Export (SheetJS)
   ===================================================== */

const Exporter = {

  // ---- Trainees list ----
  async exportTrainees() {
    const trainees = DB.getTrainees();
    const groups   = DB.getGroups();
    const specs    = DB.getSpecializations();

    const data = trainees.map(tr => {
      const grp  = groups.find(g => g.id === tr.groupId) || {};
      const spec = specs.find(s => s.id === grp.specializationId) || {};
      return [
        tr.fullName,
        tr.jobId,
        tr.companyName,
        tr.mobile,
        tr.email,
        spec.nameEn || '',
        grp.name || '',
        tr.enrollmentStart,
        tr.enrollmentEnd
      ];
    });

    const headers = [
      t('fullName'), t('jobId'), t('companyName'), t('mobile'), t('email'),
      t('specialization'), t('group'), t('enrollmentStart'), t('enrollmentEnd')
    ];

    await this._generate('Trainees', headers, data);
  },

  // ---- Attendance sheet for a group/month ----
  async exportAttendance(groupId, year, month) {
    const yearMonth = `${year}-${String(month).padStart(2,'0')}`;
    const group     = DB.getGroupById(groupId);
    const trainees  = DB.getTraineesByGroup(groupId);
    const records   = DB.getAttendanceForGroup(groupId, yearMonth);
    const attMap    = {};
    records.forEach(r => {
      if (!attMap[r.traineeId]) attMap[r.traineeId] = {};
      if (!attMap[r.traineeId][r.date]) attMap[r.traineeId][r.date] = {};
      attMap[r.traineeId][r.date][r.period || 1] = r.status;
    });
    const workDays  = Attendance.getWorkingDays(year, month, true); // Grid days
    const actualWorkDays = Attendance.getWorkingDays(year, month, false); // For stats

    const headers = [t('fullName'), t('jobId'), ...workDays.map(d => d.split('-')[2]), 'P', 'A', 'E', 'H', 'L', t('attendancePct')];
    
    const data = trainees.map(tr => {
      const row = [tr.fullName, tr.jobId];
      const counts = { P:0, A:0, E:0, H:0, L:0 };
      
      workDays.forEach(date => {
        const isH = DB.isHoliday(date);
        const day = attMap[tr.id]?.[date] || {};
        const s = isH ? 'V' : Attendance.calculateDailyStatus(day[1], day[2]);
        row.push(s || '');
        if (!isH && s && counts[s] !== undefined) counts[s]++;
      });

      const totalDays = actualWorkDays.length;
      const pct = totalDays > 0 ? Math.round((counts.P / totalDays) * 100) + '%' : '0%';
      row.push(counts.P, counts.A, counts.E, counts.H, counts.L, pct);
      return row;
    });

    await this._generate(`Attendance_${group?.name || 'Group'}`, headers, data);
  },

  // ---- Evaluations for a group/month ----
  async exportEvaluations(groupId, yearMonth) {
    const group    = DB.getGroupById(groupId);
    const trainees = DB.getTraineesByGroup(groupId);
    const evals    = DB.getEvalForGroup(groupId, yearMonth);
    const evalMap  = {};
    evals.forEach(e => { evalMap[e.traineeId] = e; });

    const headers = [t('fullName'), t('jobId'), t('score1'), t('score2'), t('totalScore'), t('grade')];
    const data = trainees.map(tr => {
      const ev = evalMap[tr.id] || {};
      const gradeInfo = ev.grade ? Evaluations.gradeInfo(ev.total || 0) : null;
      return [
        tr.fullName,
        tr.jobId,
        ev.score1 ?? '',
        ev.score2 ?? '',
        ev.total ? ev.total + '%' : '',
        gradeInfo ? gradeInfo.grade : ''
      ];
    });

    await this._generate(`Evaluations_${group?.name || 'Group'}`, headers, data);
  },

  // ---- Group report export ----
  async exportGroupReport(groupId) {
    const report = Reports.generateGroupReport(groupId);
    if (!report) return;

    const headers = ['#', t('fullName'), t('jobId'), t('companyName'), t('workingDays'), 'P', 'A', 'E', 'H', 'L', t('attendancePct'), t('grade')];
    const data = report.traineeStats.map((s, i) => [
      i + 1,
      s.trainee.fullName,
      s.trainee.jobId,
      s.trainee.companyName,
      s.total,
      s.counts.P, s.counts.A, s.counts.E, s.counts.H, s.counts.L,
      s.pct + '%',
      s.avgEval !== null ? Evaluations.gradeInfo(s.avgEval).grade : ''
    ]);

    await this._generate(`Report_${report.group.name}`, headers, data);
  },

  // ---- Trainee individual report export ----
  async exportTraineeReport(traineeId) {
    const report = Reports.generateTraineeReport(traineeId);
    if (!report) return;

    const headers = [t('month'), 'P', 'A', 'E', 'H', 'L', t('totalScore'), t('grade')];
    const data = report.attendance.months.map(m => {
      const ev = report.evaluations.find(ev => ev.month === m.month) || {};
      const gradeInfo = ev.grade ? Evaluations.gradeInfo(ev.total || 0) : null;
      return [
        m.month, m.P, m.A, m.E, m.H, m.L,
        ev.total ? ev.total + '%' : '',
        gradeInfo ? gradeInfo.grade : ''
      ];
    });

    await this._generate(`Report_${report.trainee.fullName}`, headers, data);
  },

  // ---- Private Generator ----
  async _generate(title, headers, data) {
    if (typeof ExcelJS === 'undefined') {
      Toast.show('ExcelJS library not loaded. Check internet.', 'error');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1', {
      views: [{ rightToLeft: currentLang === 'ar' }]
    });

    // Add Header Row
    const headerRow = sheet.addRow(headers);
    headerRow.height = 25;
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true, size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    // Add Data Rows
    data.forEach((rowData, idx) => {
      const row = sheet.addRow(rowData);
      row.height = 20;
      const isEven = idx % 2 === 0;
      row.eachCell(cell => {
        if (!isEven) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { size: 10 };
        cell.border = {
          top: { style: 'thin', color: { argb: 'E2E8F0' } },
          left: { style: 'thin', color: { argb: 'E2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
          right: { style: 'thin', color: { argb: 'E2E8F0' } }
        };
      });
    });

    // Auto-fit columns
    sheet.columns.forEach(column => {
      let maxLen = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const len = cell.value ? cell.value.toString().length : 10;
        if (len > maxLen) maxLen = len;
      });
      column.width = maxLen < 12 ? 12 : maxLen + 2;
    });

    // Write and Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}_${new Date().toISOString().slice(0,10)}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    Toast.show(t('saved'), 'success');
  }
};
