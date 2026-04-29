/* =====================================================
   ACADEMIC AFFAIRS — Dashboard Charts (Chart.js)
   ===================================================== */

const Charts = {
  instances: {},

  destroy(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  destroyAll() {
    Object.keys(this.instances).forEach(id => this.destroy(id));
  },

  defaults() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94A3B8', font: { size: 12 }, boxWidth: 12 } },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.95)',
          titleColor: '#F1F5F9', bodyColor: '#94A3B8',
          borderColor: 'rgba(148,163,184,0.2)', borderWidth: 1,
          padding: 10, cornerRadius: 8,
        },
      },
      scales: {
        x: { ticks: { color: '#64748B', font: { size: 11 } }, grid: { color: 'rgba(148,163,184,0.08)' } },
        y: { ticks: { color: '#64748B', font: { size: 11 } }, grid: { color: 'rgba(148,163,184,0.08)' }, beginAtZero: true },
      },
    };
  },

  // Attendance pie chart (overall distribution P/A/E/H/L)
  renderAttendancePie(canvasId) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const all = DB.getAttendance();
    const counts = { P: 0, A: 0, E: 0, H: 0, L: 0 };
    all.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
    const total = Object.values(counts).reduce((s, v) => s + v, 0);
    if (total === 0) { canvas.parentElement.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📊</div><p>${t('noData')}</p></div>`; return; }

    this.instances[canvasId] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: [t('statusPresent'), t('statusAbsent'), t('statusExcused'), t('statusHalf'), t('statusLate')],
        datasets: [{
          data: [counts.P, counts.A, counts.E, counts.H, counts.L],
          backgroundColor: ['#10B981','#EF4444','#F59E0B','#3B82F6','#8B5CF6'],
          borderColor: 'rgba(15,23,42,0.8)',
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94A3B8', font: { size: 11 }, padding: 14, boxWidth: 10 } },
          tooltip: this.defaults().plugins.tooltip,
        },
      },
    });
  },

  // Group performance bar chart
  renderGroupPerformance(canvasId) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const groups = DB.getGroups();
    if (!groups.length) { canvas.parentElement.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📊</div><p>${t('noData')}</p></div>`; return; }

    const labels = [];
    const presentRates = [];
    const evalAvgs = [];

    groups.forEach(g => {
      labels.push(g.name);
      const att = DB.getAttendance().filter(a => a.groupId === g.id);
      const total = att.length;
      const present = att.filter(a => a.status === 'P').length;
      presentRates.push(total > 0 ? Math.round((present / total) * 100) : 0);

      const evals = DB.getEvaluations().filter(e => e.groupId === g.id);
      const avgEval = evals.length > 0 ? Math.round(evals.reduce((s, e) => s + (e.total || 0), 0) / evals.length) : 0;
      evalAvgs.push(avgEval);
    });

    const d = this.defaults();
    this.instances[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: t('attendanceRate') + ' %', data: presentRates, backgroundColor: 'rgba(16,185,129,0.7)', borderColor: '#10B981', borderWidth: 1.5, borderRadius: 5 },
          { label: t('evaluationsTitle') + ' Avg %', data: evalAvgs, backgroundColor: 'rgba(79,70,229,0.7)', borderColor: '#6366F1', borderWidth: 1.5, borderRadius: 5 },
        ],
      },
      options: { ...d, plugins: { ...d.plugins }, scales: { ...d.scales, y: { ...d.scales.y, max: 100 } } },
    });
  },

  // Monthly trend line (evaluations over time)
  renderEvalTrend(canvasId, groupId) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const evals = groupId
      ? DB.getEvaluations().filter(e => e.groupId === groupId)
      : DB.getEvaluations();

    if (!evals.length) { canvas.parentElement.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📈</div><p>${t('noData')}</p></div>`; return; }

    // Group by month
    const byMonth = {};
    evals.forEach(e => {
      if (!byMonth[e.month]) byMonth[e.month] = [];
      byMonth[e.month].push(e.total || 0);
    });
    const sortedMonths = Object.keys(byMonth).sort();
    const avgByMonth = sortedMonths.map(m => Math.round(byMonth[m].reduce((s, v) => s + v, 0) / byMonth[m].length));

    const d = this.defaults();
    this.instances[canvasId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: sortedMonths,
        datasets: [{
          label: t('evaluationsTitle') + ' Avg %',
          data: avgByMonth,
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99,102,241,0.12)',
          pointBackgroundColor: '#6366F1',
          pointRadius: 5, tension: 0.4, fill: true,
        }],
      },
      options: { ...d, scales: { ...d.scales, y: { ...d.scales.y, max: 100 } } },
    });
  },

  // Specialization Distribution (Trainees per Spec)
  renderSpecDistribution(canvasId) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const specs = DB.getSpecializations();
    const trainees = DB.getTrainees();
    const groups = DB.getGroups();

    if (!specs.length || !trainees.length) {
      canvas.parentElement.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📊</div><p>${t('noData')}</p></div>`;
      return;
    }

    const data = specs.map(s => {
      const specGroups = groups.filter(g => g.specializationId === s.id).map(g => g.id);
      const count = trainees.filter(t => specGroups.includes(t.groupId)).length;
      return { label: s.nameEn, count };
    }).filter(d => d.count > 0);

    this.instances[canvasId] = new Chart(canvas, {
      type: 'polarArea',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: ['rgba(79,70,229,0.7)', 'rgba(6,182,212,0.7)', 'rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)', 'rgba(139,92,246,0.7)', 'rgba(239,68,68,0.7)'],
          borderColor: 'rgba(15,23,42,0.8)',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#94A3B8', font: { size: 10 }, boxWidth: 10 } },
          tooltip: this.defaults().plugins.tooltip,
        },
        scales: { r: { grid: { color: 'rgba(148,163,184,0.08)' }, ticks: { display: false } } },
      },
    });
  },

  // Instructor Workload (Groups per Instructor)
  renderInstructorWorkload(canvasId) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const instrs = DB.getInstructors();
    const groups = DB.getGroups();

    if (!instrs.length || !groups.length) {
      canvas.parentElement.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📊</div><p>${t('noData')}</p></div>`;
      return;
    }

    const data = instrs.map(i => {
      const count = groups.filter(g => (g.instructorIds || []).includes(i.id)).length;
      return { name: i.fullName.split(' ')[0], count };
    }).filter(d => d.count > 0).sort((a,b) => b.count - a.count).slice(0, 8);

    const d = this.defaults();
    this.instances[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: t('groups'),
          data: data.map(d => d.count),
          backgroundColor: 'rgba(6,182,212,0.7)',
          borderColor: '#06B6D4',
          borderWidth: 1.5,
          borderRadius: 4,
        }],
      },
      options: {
        ...d,
        indexAxis: 'y',
        plugins: { ...d.plugins, legend: { display: false } },
      },
    });
  },

  // Group report attendance bar
  renderGroupAttendanceBar(canvasId, data) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const d = this.defaults();
    this.instances[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: t('attendancePct'),
          data: data.values,
          backgroundColor: data.values.map(v => v >= 85 ? 'rgba(16,185,129,0.7)' : v >= 65 ? 'rgba(245,158,11,0.7)' : 'rgba(239,68,68,0.7)'),
          borderColor: data.values.map(v => v >= 85 ? '#10B981' : v >= 65 ? '#F59E0B' : '#EF4444'),
          borderWidth: 1.5, borderRadius: 6,
        }],
      },
      options: { ...d, plugins: { ...d.plugins, legend: { display: false } }, scales: { ...d.scales, y: { ...d.scales.y, max: 100 } } },
    });
  },
};
