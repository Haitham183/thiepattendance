/* =====================================================
   ACADEMIC AFFAIRS — Attendance Sheet Logic
   ===================================================== */

const Attendance = {
  STATUS_CYCLE: ['P', 'A', 'E', 'H', 'L', ''],

  // Returns true if a JS Date falls on Fri(5) or Sat(6)
  isWeekend(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDay();
    return day === 5 || day === 6;
  },

  // Get all calendar days for year/month that are working days (Sun–Thu)
  getWorkingDays(year, month, includeHolidays = false) {
    const days = [];
    const daysInMonth = new Date(year, month, 0).getDate(); // month is 1-based
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      if (this.isWeekend(dateStr)) continue;
      if (!includeHolidays && DB.isHoliday(dateStr)) continue;
      days.push(dateStr);
    }
    return days;
  },

  // Cycle to next status
  nextStatus(current) {
    const idx = this.STATUS_CYCLE.indexOf(current);
    return this.STATUS_CYCLE[(idx + 1) % this.STATUS_CYCLE.length];
  },

  // Build a map: traineeId -> date -> period -> status
  buildMap(records) {
    const map = {};
    records.forEach(r => {
      if (!map[r.traineeId]) map[r.traineeId] = {};
      if (!map[r.traineeId][r.date]) map[r.traineeId][r.date] = {};
      map[r.traineeId][r.date][r.period || 1] = r.status;
    });
    return map;
  },

  // Render the full attendance sheet HTML
  render(groupId, year, month) {
    const group    = DB.getGroupById(groupId);
    const trainees = DB.getTraineesByGroup(groupId);
    const yearMonth = `${year}-${String(month).padStart(2,'0')}`;
    const records   = DB.getAttendanceForGroup(groupId, yearMonth);
    const attMap    = this.buildMap(records);
    const workDays  = this.getWorkingDays(year, month, true); // Include holidays for grid display

    if (!group) return `<div class="empty-state"><p>${t('noData')}</p></div>`;

    const dayHeaders = workDays.map(d => {
      const date = new Date(d + 'T00:00:00');
      const dayN = date.getDate();
      const dayLabels = [t('sunday'),t('monday'),t('tuesday'),t('wednesday'),t('thursday')];
      const label = dayLabels[date.getDay()] || '';
      const isH = DB.isHoliday(d);
      return `<th title="${d}" class="${isH?'is-holiday':''}">
        ${dayN}<br><span style="font-weight:400;font-size:.65rem">${isH ? 'Holiday' : label}</span>
      </th>`;
    }).join('');

    // Rows
    const rows = trainees.length === 0
      ? `<tr><td colspan="${workDays.length + 3}" class="text-center text-muted" style="padding:2rem">${t('noData')}</td></tr>`
      : trainees.map(trainee => {
          const cells = workDays.map(date => {
            const isH = DB.isHoliday(date);
            const statuses = attMap[trainee.id]?.[date] || {};
            
            const renderCell = (period) => {
              const status = isH ? 'V' : (statuses[period] || '');
              const canEdit = Auth.isAdminOrSupervisor() || this.canInstructorEdit(groupId, period);
              return `
                <div class="att-cell-mini ${status ? 'status-' + status : 'empty'} ${isH?'is-holiday':''} ${!canEdit?'disabled':''}"
                     data-trainee="${trainee.id}"
                     data-date="${date}"
                     data-group="${groupId}"
                     data-period="${period}"
                     data-status="${status}"
                     ${isH || !canEdit ? '' : 'onclick="Attendance.handleCellClick(this)"'}>
                  ${status || (period === 1 ? '①' : '②')}
                </div>`;
            };

            return `<td>
              <div class="att-split-cell">
                ${renderCell(1)}
                ${renderCell(2)}
              </div>
            </td>`;
          }).join('');

          // Summary counts (aggregated daily logic)
          const trAtt = attMap[trainee.id] || {};
          let p=0, a=0, e=0, h=0, l=0;
          
          workDays.forEach(date => {
            if (DB.isHoliday(date)) return;
            const dayAtt = trAtt[date] || {};
            const s1 = dayAtt[1] || '';
            const s2 = dayAtt[2] || '';
            const status = this.calculateDailyStatus(s1, s2);
            if (status === 'P') p++;
            else if (status === 'A') a++;
            else if (status === 'E') e++;
            else if (status === 'H') h++;
            else if (status === 'L') l++;
          });

          return `<tr>
            <td class="trainee-col"><div style="font-weight:600">${trainee.fullName}</div></td>
            <td class="jobid-col"><span class="badge badge-gray">${trainee.jobId}</span></td>
            ${cells}
            <td style="text-align:center;min-width:40px"><span class="badge badge-success">${p}</span></td>
            <td style="text-align:center;min-width:40px"><span class="badge badge-danger">${a}</span></td>
            <td style="text-align:center;min-width:40px"><span class="badge badge-warning">${e}</span></td>
            <td style="text-align:center;min-width:40px"><span class="badge badge-info">${h}</span></td>
            <td style="text-align:center;min-width:40px"><span class="badge badge-purple">${l}</span></td>
          </tr>`;
        }).join('');

    return `
      <table class="att-table">
        <thead>
          <tr>
            <th class="trainee-col">${t('fullName')}</th>
            <th class="jobid-col">${t('jobId')}</th>
            ${dayHeaders}
            <th style="background:var(--status-p-bg);color:var(--status-p)">P</th>
            <th style="background:var(--status-a-bg);color:var(--status-a)">A</th>
            <th style="background:var(--status-e-bg);color:var(--status-e)">E</th>
            <th style="background:var(--status-h-bg);color:var(--status-h)">H</th>
            <th style="background:var(--status-l-bg);color:var(--status-l)">L</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  },

  // Handle cell click — cycle status and persist immediately
  handleCellClick(cell) {
    const traineeId = cell.dataset.trainee;
    const date      = cell.dataset.date;
    const groupId   = cell.dataset.group;
    const period    = parseInt(cell.dataset.period);
    const current   = cell.dataset.status || '';
    const next      = this.nextStatus(current);

    // Permission check
    if (!Auth.isAdminOrSupervisor() && !this.canInstructorEdit(groupId, period)) {
      Toast.show(t('noPermission'), 'error');
      return;
    }

    // Update DOM
    cell.dataset.status = next;
    cell.className = `att-cell-mini ${next ? 'status-' + next : 'empty'}`;
    cell.textContent = next || (period === 1 ? '①' : '②');

    // Persist
    DB.upsertAttendance(groupId, traineeId, date, next, period);

    // Update summary counters in the same row
    this.updateRowSummary(cell.closest('tr'), groupId);
  },

  updateRowSummary(row, groupId) {
    if (!row) return;
    const miniCells = row.querySelectorAll('.att-cell-mini[data-status]');
    // Map data-date -> period -> status
    const dayMap = {};
    miniCells.forEach(c => {
      const d = c.dataset.date;
      const p = c.dataset.period;
      if (!dayMap[d]) dayMap[d] = {};
      dayMap[d][p] = c.dataset.status;
    });

    const counts = { P:0, A:0, E:0, H:0, L:0 };
    Object.values(dayMap).forEach(day => {
      const s = this.calculateDailyStatus(day[1], day[2]);
      if (s && counts[s] !== undefined) counts[s]++;
    });

    const summaryTds = [...row.querySelectorAll('td')].slice(-5);
    const keys = ['P','A','E','H','L'];
    summaryTds.forEach((td, i) => { const b = td.querySelector('.badge'); if(b) b.textContent = counts[keys[i]] || 0; });
  },

  calculateDailyStatus(s1, s2) {
    if (!s1 && !s2) return null;
    if (s1 === 'P' && s2 === 'P') return 'P';
    if (s1 === 'A' && s2 === 'A') return 'A';
    // The user's specific rule: one P and one A = Half Day (H)
    if ((s1 === 'P' && s2 === 'A') || (s1 === 'A' && s2 === 'P')) return 'H';
    // Other mixes
    if (s1 === 'E' || s2 === 'E') return 'E'; // If any is excused, count as E
    if (s1 === 'H' || s2 === 'H') return 'H'; // If any is already half, day is half
    if (s1 === 'L' || s2 === 'L') return 'L'; // Late
    if (s1 === 'P' || s2 === 'P') return 'H'; // One present, one empty -> count as half for summary
    return s1 || s2;
  },

  // Mark all trainees in a group as Present for all working days
  markAllPresent(groupId, year, month) {
    const period = this.getInstructorActivePeriod(groupId);
    if (!period && !Auth.isAdminOrSupervisor()) { Toast.show(t('noPermission'),'error'); return; }

    const targetPeriods = period ? [period] : [1, 2];
    const trainees  = DB.getTraineesByGroup(groupId);
    const workDays  = this.getWorkingDays(year, month);
    const records   = [];
    trainees.forEach(tr => {
      workDays.forEach(date => {
        targetPeriods.forEach(p => records.push({ groupId, traineeId: tr.id, date, status: 'P', period: p }));
      });
    });
    DB.bulkUpsertAttendance(records);
    Toast.show(t('attendanceSaved'), 'success');
    // Re-render
    const groupSel  = document.getElementById('att-group');
    const monthSel  = document.getElementById('att-month');
    const yearSel   = document.getElementById('att-year');
    if (groupSel) Views.attendance({ groupId: groupSel.value, month: parseInt(monthSel.value), year: parseInt(yearSel.value) });
  },

  // Clear all attendance records for a group/month (restricted by period if instructor)
  clearAll(groupId, year, month) {
    const period = this.getInstructorActivePeriod(groupId);
    if (!period && !Auth.isAdminOrSupervisor()) {
      Toast.show(t('noPermission'), 'error');
      return;
    }

    Modal.confirm(t('clearAllConfirm'), () => {
      const targetPeriods = period ? [period] : [1, 2];
      const trainees  = DB.getTraineesByGroup(groupId);
      const workDays  = this.getWorkingDays(year, month, true);
      const records   = [];

      trainees.forEach(tr => {
        workDays.forEach(date => {
          targetPeriods.forEach(p => {
            records.push({ groupId, traineeId: tr.id, date, status: '', period: p });
          });
        });
      });

      DB.bulkUpsertAttendance(records);
      Toast.show(t('cleared'), 'success');
      
      // Refresh current view
      const groupSel  = document.getElementById('att-group');
      const monthSel  = document.getElementById('att-month');
      const yearSel   = document.getElementById('att-year');
      if (groupSel) Views.attendance({ 
        groupId: groupSel.value, 
        month: parseInt(monthSel.value), 
        year: parseInt(yearSel.value) 
      });
    });
  },

  canInstructorEdit(groupId, period) {
    const session = Auth.getSession();
    if (!session || session.role !== 'instructor') return false;
    const group = DB.getGroupById(groupId);
    if (!group) return false;
    const instrId = (Auth.getCurrentInstructor()||{}).id;
    if (period === 1) return group.p1?.instructorId === instrId;
    if (period === 2) return group.p2?.instructorId === instrId;
    return false;
  },

  getInstructorActivePeriod(groupId) {
    if (this.canInstructorEdit(groupId, 1)) return 1;
    if (this.canInstructorEdit(groupId, 2)) return 2;
    return null;
  },

  // Build month selector options
  monthOptions(selectedMonth) {
    const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    return months.map((m, i) =>
      `<option value="${i+1}" ${i+1 === selectedMonth ? 'selected' : ''}>${t(m)}</option>`
    ).join('');
  },

  yearOptions(selectedYear) {
    const now = new Date().getFullYear();
    let opts = '';
    for (let y = now - 2; y <= now + 2; y++) {
      opts += `<option value="${y}" ${y === selectedYear ? 'selected' : ''}>${y}</option>`;
    }
    return opts;
  },
};
