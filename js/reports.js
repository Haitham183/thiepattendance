/* =====================================================
   ACADEMIC AFFAIRS — Reports Module
   ===================================================== */

const Reports = {

  // ---- Trainee Report ----
  generateTraineeReport(jobId) {
    const trainee = DB.getTraineeByJobId(jobId.trim());
    if (!trainee) return null;

    const group   = DB.getGroupById(trainee.groupId) || {};
    const spec    = DB.getSpecById(group.specializationId) || {};
    const attRecs = DB.getAttendanceForTrainee(trainee.id);
    const evalRecs = DB.getEvalForTrainee(trainee.id);

    // Aggregate attendance (2 periods -> 1 day)
    const aggregated = this._aggregateAttendance(attRecs);
    const attCounts = aggregated.counts;
    const totalDays = aggregated.totalDays;
    const attPct = totalDays > 0 ? Math.round((attCounts.P / totalDays) * 100) : 0;

    return { trainee, group, spec, attRecs: aggregated.list, evalRecs, attCounts, totalDays, attPct };
  },

  _aggregateAttendance(recs) {
    const dateMap = {};
    const monthsInvolved = new Set();
    recs.forEach(a => {
      if (!dateMap[a.date]) dateMap[a.date] = {};
      dateMap[a.date][a.period || 1] = a.status;
      monthsInvolved.add(a.date.slice(0, 7));
    });

    const list = [];
    const counts = { P:0, A:0, E:0, H:0, L:0 };
    Object.entries(dateMap).sort().forEach(([date, periods]) => {
      const s = Attendance.calculateDailyStatus(periods[1], periods[2]);
      if (s) {
        list.push({ date, status: s });
        if (counts[s] !== undefined) counts[s]++;
      }
    });

    // Calculate total possible working days across all months involved
    let totalWorkingDays = 0;
    monthsInvolved.forEach(ym => {
      const [y, m] = ym.split('-').map(Number);
      totalWorkingDays += Attendance.getWorkingDays(y, m).length;
    });

    return { list, counts, totalDays: totalWorkingDays };
  },

  renderTraineeReport(data) {
    if (!data) return `<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-title">${t('noData')}</div></div>`;
    const { trainee, group, spec, attRecs, evalRecs, attCounts, totalDays, attPct } = data;

    // Group attendance by month
    const byMonth = {};
    attRecs.forEach(a => {
      const ym = a.date.slice(0, 7);
      if (!byMonth[ym]) byMonth[ym] = { P:0, A:0, E:0, H:0, L:0 };
      if (byMonth[ym][a.status] !== undefined) byMonth[ym][a.status]++;
    });

    const attMonthRows = Object.entries(byMonth).sort().map(([ym, c]) => {
      const [y, m] = ym.split('-').map(Number);
      const workDays = Attendance.getWorkingDays(y, m).length;
      const pct = workDays > 0 ? Math.round((c.P / workDays) * 100) : 0;
      return `<tr>
        <td>${ym}</td>
        <td><span class="badge badge-gray">${workDays}</span></td>
        <td><span class="badge badge-success">${c.P}</span></td>
        <td><span class="badge badge-danger">${c.A}</span></td>
        <td><span class="badge badge-warning">${c.E}</span></td>
        <td><span class="badge badge-info">${c.H}</span></td>
        <td><span class="badge badge-purple">${c.L}</span></td>
        <td><strong style="color:${pct>=75?'var(--status-p)':pct>=50?'var(--status-e)':'var(--status-a)'}">${pct}%</strong></td>
      </tr>`;
    }).join('') || `<tr><td colspan="8" class="text-center text-muted">${t('noData')}</td></tr>`;

    const evalRows = evalRecs.map(e => {
      const info = Evaluations.gradeInfo(e.total || 0);
      return `<tr>
        <td>${e.month}</td>
        <td style="text-align:center">${e.score1}</td>
        <td style="text-align:center">${e.score2}</td>
        <td style="text-align:center;font-weight:700">${e.total}%</td>
        <td style="text-align:center"><span class="grade-badge ${info.cls}">${info.label()}</span></td>
      </tr>`;
    }).join('') || `<tr><td colspan="5" class="text-center text-muted">${t('noData')}</td></tr>`;

    return `
      <div class="print-header">
        <div><h1>${t('traineeReportTitle')}</h1><p>${new Date().toLocaleDateString()}</p></div>
      </div>
      <div class="report-trainee-header">
        <div class="report-trainee-name">${trainee.fullName}</div>
        <div class="report-trainee-meta">
          <div class="report-meta-item">🪪 <strong>${t('jobId')}:</strong> ${trainee.jobId}</div>
          <div class="report-meta-item">🏢 <strong>${t('companyName')}:</strong> ${trainee.companyName}</div>
          <div class="report-meta-item">📱 <strong>${t('mobile')}:</strong> ${trainee.mobile}</div>
          <div class="report-meta-item">📚 <strong>${t('specialization')}:</strong> ${spec.nameEn || '—'}</div>
          <div class="report-meta-item">👥 <strong>${t('group')}:</strong> ${group.name || '—'}</div>
          <div class="report-meta-item">📅 <strong>${t('enrollmentStart')}:</strong> ${trainee.enrollmentStart || '—'}</div>
          <div class="report-meta-item">📅 <strong>${t('enrollmentEnd')}:</strong> ${trainee.enrollmentEnd || '—'}</div>
        </div>
        <div style="margin-top:1rem;display:flex;gap:1rem;flex-wrap:wrap">
          <div class="kpi-card" style="flex:1;min-width:140px;--kpi-color:var(--status-p);--kpi-bg:var(--status-p-bg)">
            <div class="kpi-icon">✓</div>
            <div class="kpi-content"><div class="kpi-value">${attPct}%</div><div class="kpi-label">${t('attendancePct')}</div></div>
          </div>
          <div class="kpi-card" style="flex:1;min-width:140px;--kpi-color:var(--status-p);--kpi-bg:var(--status-p-bg)">
            <div class="kpi-icon">📅</div>
            <div class="kpi-content"><div class="kpi-value">${attCounts.P}</div><div class="kpi-label">${t('presentDays')}</div></div>
          </div>
          <div class="kpi-card" style="flex:1;min-width:140px;--kpi-color:var(--status-a);--kpi-bg:var(--status-a-bg)">
            <div class="kpi-icon">✕</div>
            <div class="kpi-content"><div class="kpi-value">${attCounts.A}</div><div class="kpi-label">${t('absentDays')}</div></div>
          </div>
        </div>
      </div>

      <div class="report-section">
        <div class="report-section-title">📊 ${t('attendanceSummary')}</div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>${t('month')}</th><th>${t('workingDays')}</th>
              <th>${t('presentDays')}</th><th>${t('absentDays')}</th>
              <th>${t('excusedDays')}</th><th>${t('halfDays')}</th>
              <th>${t('lateDays')}</th><th>${t('attendancePct')}</th>
            </tr></thead>
            <tbody>${attMonthRows}</tbody>
          </table>
        </div>
      </div>

      <div class="report-section">
        <div class="report-section-title">📝 ${t('evaluationHistory')}</div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>${t('month')}</th><th>${t('score1')}</th>
              <th>${t('score2')}</th><th>${t('totalScore')}</th><th>${t('grade')}</th>
            </tr></thead>
            <tbody>${evalRows}</tbody>
          </table>
        </div>
      </div>
    `;
  },

  // ---- Group Report ----
  generateGroupReport(groupId) {
    const group    = DB.getGroupById(groupId);
    if (!group) return null;
    const spec     = DB.getSpecById(group.specializationId) || {};
    const trainees = DB.getTraineesByGroup(groupId);
    const allAtt   = DB.getAttendance().filter(a => a.groupId === groupId);
    const allEvals = DB.getEvaluations().filter(e => e.groupId === groupId);

    // Per-trainee stats
    const traineeStats = trainees.map(tr => {
      const att = allAtt.filter(a => a.traineeId === tr.id);
      const aggregated = this._aggregateAttendance(att);
      
      const trEvals = allEvals.filter(e => e.traineeId === tr.id);
      const avgEval = trEvals.length > 0 ? Math.round(trEvals.reduce((s,e) => s + (e.total||0), 0) / trEvals.length) : null;
      
      return { 
        trainee: tr, 
        counts: aggregated.counts, 
        total: aggregated.totalDays, 
        pct: aggregated.totalDays > 0 ? Math.round((aggregated.counts.P / aggregated.totalDays) * 100) : 0, 
        avgEval 
      };
    });

    // Overall totals
    const overallAgg = this._aggregateAttendance(allAtt);
    const overall = overallAgg.counts;
    const overallTotal = overallAgg.totalDays;
    const overallPct   = overallTotal > 0 ? Math.round((overall.P / overallTotal) * 100) : 0;

    return { group, spec, trainees, traineeStats, overall, overallTotal, overallPct, allEvals };
  },

  renderGroupReport(data) {
    if (!data) return `<div class="empty-state"><div class="empty-state-icon">📊</div><div class="empty-state-title">${t('noData')}</div></div>`;
    const { group, spec, traineeStats, overall, overallTotal, overallPct } = data;

    const rows = traineeStats.map((s, idx) => {
      const pctColor = s.pct >= 75 ? 'var(--status-p)' : s.pct >= 50 ? 'var(--status-e)' : 'var(--status-a)';
      const gradeHtml = s.avgEval !== null ? Evaluations.gradeBadge(s.avgEval) : '<span style="color:var(--text-3)">—</span>';
      return `<tr>
        <td>${idx + 1}</td>
        <td><strong>${s.trainee.fullName}</strong></td>
        <td><span class="badge badge-gray">${s.trainee.jobId}</span></td>
        <td style="text-align:center"><span class="badge badge-gray">${s.total}</span></td>
        <td style="text-align:center"><span class="badge badge-success">${s.counts.P}</span></td>
        <td style="text-align:center"><span class="badge badge-danger">${s.counts.A}</span></td>
        <td style="text-align:center"><span class="badge badge-warning">${s.counts.E}</span></td>
        <td style="text-align:center"><span class="badge badge-info">${s.counts.H}</span></td>
        <td style="text-align:center"><span class="badge badge-purple">${s.counts.L}</span></td>
        <td style="text-align:center;font-weight:700;color:${pctColor}">${s.pct}%</td>
        <td style="text-align:center">${gradeHtml}</td>
      </tr>`;
    }).join('') || `<tr><td colspan="11" class="text-center text-muted">${t('noData')}</td></tr>`;

    const chartLabels = JSON.stringify(traineeStats.map(s => s.trainee.fullName.split(' ')[0]));
    const chartValues = JSON.stringify(traineeStats.map(s => s.pct));

    return `
      <div class="print-header">
        <div><h1>${t('groupReportTitle')}: ${group.name}</h1><p>${new Date().toLocaleDateString()}</p></div>
      </div>
      <div class="grid-4" style="margin-bottom:1.5rem">
        <div class="kpi-card" style="--kpi-color:var(--primary);--kpi-bg:rgba(79,70,229,.15)">
          <div class="kpi-icon">👥</div>
          <div class="kpi-content"><div class="kpi-value">${traineeStats.length}</div><div class="kpi-label">${t('totalTrainees')}</div></div>
        </div>
        <div class="kpi-card" style="--kpi-color:var(--status-p);--kpi-bg:var(--status-p-bg)">
          <div class="kpi-icon">✓</div>
          <div class="kpi-content"><div class="kpi-value">${overallPct}%</div><div class="kpi-label">${t('attendancePct')}</div></div>
        </div>
        <div class="kpi-card" style="--kpi-color:var(--status-p);--kpi-bg:var(--status-p-bg)">
          <div class="kpi-icon">📅</div>
          <div class="kpi-content"><div class="kpi-value">${overall.P}</div><div class="kpi-label">${t('presentDays')}</div></div>
        </div>
        <div class="kpi-card" style="--kpi-color:var(--status-a);--kpi-bg:var(--status-a-bg)">
          <div class="kpi-icon">✕</div>
          <div class="kpi-content"><div class="kpi-value">${overall.A}</div><div class="kpi-label">${t('absentDays')}</div></div>
        </div>
      </div>

      <div class="report-section no-print">
        <div class="report-section-title">📈 ${t('attendanceBreakdown')}</div>
        <div class="chart-wrap"><canvas id="group-report-chart"></canvas></div>
      </div>

      <div class="report-section">
        <div class="report-section-title">👤 ${t('trainees')} — ${t('attendanceBreakdown')}</div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>#</th><th>${t('fullName')}</th><th>${t('jobId')}</th>
              <th style="text-align:center">${t('workingDays')}</th>
              <th style="text-align:center">P</th><th style="text-align:center">A</th>
              <th style="text-align:center">E</th><th style="text-align:center">H</th>
              <th style="text-align:center">L</th>
              <th style="text-align:center">${t('attendancePct')}</th>
              <th style="text-align:center">${t('grade')}</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
      <script>
        setTimeout(()=>{
          const labels=${chartLabels};
          const values=${chartValues};
          Charts.renderGroupAttendanceBar('group-report-chart',{labels,values});
        },100);
      </script>
    `;
  },
};
