/* =====================================================
   ACADEMIC AFFAIRS — Evaluations Module
   ===================================================== */

const Evaluations = {
  GRADE_THRESHOLDS: [
    { min: 85, grade: 'Excellent',  label: () => t('gradeExcellent'), cls: 'grade-Excellent' },
    { min: 65, grade: 'VeryGood',   label: () => t('gradeVeryGood'),  cls: 'grade-VeryGood'  },
    { min: 50, grade: 'Good',       label: () => t('gradeGood'),      cls: 'grade-Good'      },
    { min:  0, grade: 'Poor',       label: () => t('gradePoor'),      cls: 'grade-Poor'      },
  ],

  calcTotal(s1, s2) {
    const a = parseFloat(s1) || 0;
    const b = parseFloat(s2) || 0;
    return Math.round((a + b) / 2 * 10) / 10;
  },

  gradeInfo(total) {
    return this.GRADE_THRESHOLDS.find(g => total >= g.min) || this.GRADE_THRESHOLDS[3];
  },

  gradeBadge(total) {
    const info = this.gradeInfo(total);
    return `<span class="grade-badge ${info.cls}">${info.label()}</span>`;
  },

  // Render the evaluation table for a group/month
  // Render the evaluation table for a group/month
  render(groupId, yearMonth) {
    const group    = DB.getGroupById(groupId);
    const trainees = DB.getTraineesByGroup(groupId) || [];
    const evals    = DB.getEvalForGroup(groupId, yearMonth) || [];

    if (!group) return `<div class="empty-state"><p>${t('noData')}</p></div>`;

    // Identify current target instructor
    const session = Auth.getSession();
    const currentInstrId = (Auth.getCurrentInstructor()||{}).id;
    let targetInstrId = currentInstrId;
    
    // For Admins/Supervisors, allow switching between P1 and P2 instructors
    if (Auth.isAdminOrSupervisor()) {
      const p1Id = group.p1?.instructorId;
      const p2Id = group.p2?.instructorId;
      const selectEl = document.getElementById('eval-instructor-select');
      targetInstrId = selectEl ? selectEl.value : (p1Id || p2Id);
    }

    // Build map: traineeId -> eval record for the specific instructor
    const evalMap = {};
    if (targetInstrId) {
      evals.filter(e => e.instructorId === targetInstrId).forEach(e => {
        evalMap[e.traineeId] = e;
      });
    }

    // Instructor info for the header
    const targetInstr = DB.getInstructorById(targetInstrId);
    const instrName = targetInstr ? targetInstr.fullName : t('none');
    const specName = targetInstr ? (DB.getSpecById(targetInstr.specializationId)||{}).nameEn : '';

    if (trainees.length === 0) {
      return `<div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-title">${t('noData')}</div>
        <p class="empty-state-desc">${t('addTrainee')}</p>
      </div>`;
    }

    const rows = trainees.map((tr, idx) => {
      const ev = evalMap[tr.id] || {};
      const s1 = ev.score1 !== undefined ? ev.score1 : '';
      const s2 = ev.score2 !== undefined ? ev.score2 : '';
      const total = (s1 !== '' && s2 !== '') ? this.calcTotal(s1, s2) : '';
      const badge = total !== '' ? this.gradeBadge(total) : '<span style="color:var(--text-3)">—</span>';

      return `<tr id="eval-row-${tr.id}">
        <td style="padding:.75rem 1rem">${idx + 1}</td>
        <td style="padding:.75rem 1rem;font-weight:600">${tr.fullName}</td>
        <td style="padding:.75rem 1rem"><span class="badge badge-gray">${tr.jobId}</span></td>
        <td style="padding:.75rem 1rem;text-align:center">
          <input type="number" class="score-input" id="s1-${tr.id}"
            min="0" max="100" step="0.5" value="${s1}"
            placeholder="0–100"
            onchange="Evaluations.onScoreChange('${tr.id}','${groupId}','${yearMonth}','${targetInstrId}')"
            oninput="Evaluations.previewTotal('${tr.id}')">
        </td>
        <td style="padding:.75rem 1rem;text-align:center">
          <input type="number" class="score-input" id="s2-${tr.id}"
            min="0" max="100" step="0.5" value="${s2}"
            placeholder="0–100"
            onchange="Evaluations.onScoreChange('${tr.id}','${groupId}','${yearMonth}','${targetInstrId}')"
            oninput="Evaluations.previewTotal('${tr.id}')">
        </td>
        <td style="padding:.75rem 1rem;text-align:center;font-weight:700;font-size:1rem" id="total-${tr.id}">
          ${total !== '' ? total + '%' : '<span style="color:var(--text-3)">—</span>'}
        </td>
        <td style="padding:.75rem 1rem;text-align:center" id="grade-${tr.id}">
          ${badge}
        </td>
      </tr>`;
    }).join('');

    const adminSelector = Auth.isAdminOrSupervisor() ? `
      <div class="card mb-4" style="padding:1rem;background:var(--bg-glass)">
        <div class="flex items-center gap-3">
          <label class="text-sm font-semibold">${t('instructor')}:</label>
          <select id="eval-instructor-select" class="form-control" style="max-width:250px" onchange="Views._reloadEval()">
            ${group.p1?.instructorId ? `<option value="${group.p1.instructorId}" ${targetInstrId===group.p1.instructorId?'selected':''}>P1: ${DB.getInstructorById(group.p1.instructorId)?.fullName}</option>` : ''}
            ${group.p2?.instructorId ? `<option value="${group.p2.instructorId}" ${targetInstrId===group.p2.instructorId?'selected':''}>P2: ${DB.getInstructorById(group.p2.instructorId)?.fullName}</option>` : ''}
          </select>
        </div>
      </div>` : `
      <div class="card mb-4" style="padding:1rem;background:var(--bg-glass)">
        <div class="text-sm"><strong>${t('instructor')}:</strong> ${instrName} <span class="text-muted ml-2">(${specName || ''})</span></div>
      </div>`;

    return `
      ${adminSelector}
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>${t('fullName')}</th>
              <th>${t('jobId')}</th>
              <th style="text-align:center">${t('score1')}</th>
              <th style="text-align:center">${t('score2')}</th>
              <th style="text-align:center">${t('totalScore')}</th>
              <th style="text-align:center">${t('grade')}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  },

  // Live total preview
  previewTotal(traineeId) {
    const s1 = document.getElementById(`s1-${traineeId}`).value;
    const s2 = document.getElementById(`s2-${traineeId}`).value;
    const totalEl = document.getElementById(`total-${traineeId}`);
    const gradeEl = document.getElementById(`grade-${traineeId}`);
    
    if (s1 === '' || s2 === '') {
      totalEl.innerHTML = '<span style="color:var(--text-3)">—</span>';
      gradeEl.innerHTML = '<span style="color:var(--text-3)">—</span>';
      return;
    }

    const total = this.calcTotal(s1, s2);
    totalEl.textContent = total + '%';
    gradeEl.innerHTML = this.gradeBadge(total);
  },

  // Per-trainee persistence
  onScoreChange(traineeId, groupId, yearMonth, instructorId) {
    const s1 = document.getElementById(`s1-${traineeId}`).value;
    const s2 = document.getElementById(`s2-${traineeId}`).value;
    DB.upsertEvaluation(groupId, traineeId, yearMonth, s1, s2, instructorId);
    Toast.show(t('saved'), 'success', 1000);
  },

  // Bulk persistence
  saveAll(groupId, yearMonth) {
    const trainees = DB.getTraineesByGroup(groupId);
    const instrEl = document.getElementById('eval-instructor-select');
    const instructorId = instrEl ? instrEl.value : (Auth.getCurrentInstructor()||{}).id;
    let savedCount = 0;

    if (!instructorId) {
      Toast.show('No instructor assigned', 'error');
      return;
    }

    trainees.forEach(tr => {
      const s1 = document.getElementById(`s1-${tr.id}`)?.value;
      const s2 = document.getElementById(`s2-${tr.id}`)?.value;
      if (s1 !== undefined && s2 !== undefined && s1 !== '' && s2 !== '') {
        DB.upsertEvaluation(groupId, tr.id, yearMonth, s1, s2, instructorId);
        savedCount++;
      }
    });

    Toast.show(`${t('saved')} (${savedCount})`, 'success');
    Router.refresh();
  },
};
