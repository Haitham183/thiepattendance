/* =====================================================
   ACADEMIC AFFAIRS — App Controller Part 2
   Instructors, Trainees, Portal, Attendance, Evaluations
   ===================================================== */

// Extend Views object
Object.assign(Views, {

  // ---- Instructors ----
  instructors() {
    const list  = DB.getInstructors();
    const specs = DB.getSpecializations();
    const rows  = list.map(i => {
      const spec = specs.find(s=>s.id===i.specializationId)||{};
      const user = DB.getUserById(i.userId)||{};
      return `<tr>
        <td><strong>${i.fullName}</strong></td>
        <td>${i.email||'—'}</td><td>${i.phone||'—'}</td>
        <td><span class="badge badge-primary">${spec.nameEn||'—'}</span></td>
        <td><span class="badge badge-gray">${user.username||'—'}</span></td>
        <td><div class="table-actions">
          <button class="btn btn-sm btn-secondary" onclick="Views.openInstrModal('${i.id}')">✏️ ${t('edit')}</button>
          <button class="btn btn-sm btn-danger" onclick="Views.deleteInstr('${i.id}')">🗑</button>
        </div></td></tr>`;
    }).join('')||`<tr><td colspan="6" class="text-center text-muted" style="padding:2rem">${t('noData')}</td></tr>`;

    document.getElementById('main').innerHTML = `
      <div class="page-header">
        <div><div class="page-title">👨‍🏫 ${t('instructors')}</div></div>
        <button class="btn btn-primary" onclick="Views.openInstrModal()">+ ${t('addInstructor')}</button>
      </div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${t('fullName')}</th><th>${t('email')}</th><th>${t('phone')}</th><th>${t('specialization')}</th><th>${t('username')}</th><th>${t('actions')}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  },

  openInstrModal(id) {
    const instr = id ? DB.getInstructorById(id) : null;
    const specs = DB.getSpecializations();
    const specOpts = specs.map(s=>`<option value="${s.id}" ${instr&&instr.specializationId===s.id?'selected':''}>${s.nameEn}</option>`).join('');
    const user = instr && instr.userId ? DB.getUserById(instr.userId)||{} : {};
    Modal.open({
      title: instr ? t('editInstructor') : t('addInstructor'),
      body: `
        <div class="form-row">
          <div class="form-group"><label class="form-label">${t('fullName')} <span class="req">*</span></label>
            <input id="instr-name" class="form-control" value="${instr?instr.fullName:''}"></div>
          <div class="form-group"><label class="form-label">${t('specialization')} <span class="req">*</span></label>
            <select id="instr-spec" class="form-control"><option value="">— ${t('select')} —</option>${specOpts}</select></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">${t('email')}</label>
            <input id="instr-email" type="email" class="form-control" value="${instr?instr.email:''}"></div>
          <div class="form-group"><label class="form-label">${t('phone')}</label>
            <input id="instr-phone" class="form-control" value="${instr?instr.phone:''}"></div>
        </div>
        <div style="border-top:1px solid var(--border);margin:1rem 0;padding-top:1rem">
          <div class="form-row">
            <div class="form-group"><label class="form-label">${t('username')} <span class="req">*</span></label>
              <input id="instr-user" class="form-control" value="${user.username||''}"></div>
            <div class="form-group"><label class="form-label">${t('password')} ${id?'(leave blank to keep)':''}</label>
              <input id="instr-pass" type="password" class="form-control" placeholder="${id?'••••••':''}"></div>
          </div>
        </div>`,
      footer: `<button class="btn btn-secondary" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary" onclick="Views.saveInstr('${id||''}')">${t('save')}</button>`,
    });
  },

  saveInstr(id) {
    const name  = document.getElementById('instr-name').value.trim();
    const specId= document.getElementById('instr-spec').value;
    const email = document.getElementById('instr-email').value.trim();
    const phone = document.getElementById('instr-phone').value.trim();
    const uname = document.getElementById('instr-user').value.trim();
    const pass  = document.getElementById('instr-pass').value;
    if (!name||!specId||!uname) { Toast.show(t('required'),'error'); return; }

    let userId = id ? (DB.getInstructorById(id)||{}).userId : null;
    if (!userId) {
      if (!pass) { Toast.show(t('required'),'error'); return; }
      const newUser = DB.addUser({ username:uname, passwordHash:Auth.hash(pass), role:'instructor', displayName:name, permissions:{ viewReports:true } });
      userId = newUser.id;
    } else {
      DB.updateUser(userId, { username:uname, displayName:name, ...(pass?{passwordHash:Auth.hash(pass)}:{}) });
    }

    if (id) { DB.updateInstructor(id,{fullName:name,specializationId:specId,email,phone,userId}); }
    else    { const instr=DB.addInstructor({fullName:name,specializationId:specId,email,phone,userId}); DB.updateUser(userId,{instructorId:instr.id}); }
    Modal.close(); Toast.show(t('saved')); Router.refresh();
  },

  deleteInstr(id) {
    Modal.confirm(t('deleteInstrConfirm'), ()=>{ DB.deleteInstructor(id); Toast.show(t('deleted')); Router.refresh(); });
  },

  // ---- Trainees ----
  trainees() {
    let list   = DB.getTrainees();
    let groups = DB.getGroups();
    const specs  = DB.getSpecializations();
    
    // Instructor isolation
    if (Auth.isInstructor()) {
      const instr = Auth.getCurrentInstructor();
      if (instr) {
        groups = DB.getGroupsForInstructor(instr.id);
        const groupIds = groups.map(g => g.id);
        list = list.filter(tr => groupIds.includes(tr.groupId));
      } else {
        list = []; groups = [];
      }
    }

    const renderTable = (items) => {
      return items.map(tr => {
        const grp  = groups.find(g=>g.id===tr.groupId)||{};
        const spec = specs.find(s=>s.id===grp.specializationId)||{};
        return `<tr>
          <td><strong>${tr.fullName}</strong></td>
          <td><span class="badge badge-primary">${tr.jobId}</span></td>
          <td>${tr.companyName||'—'}</td><td>${tr.mobile||'—'}</td>
          <td><span class="badge badge-info">${grp.name||'—'}</span></td>
          <td><span class="badge badge-gray">${spec.nameEn||'—'}</span></td>
          <td>${tr.enrollmentStart||'—'}</td>
          <td><div class="table-actions">
            <button class="btn btn-sm btn-secondary" onclick="Views.openTraineeModal('${tr.id}')">✏️</button>
            ${Auth.can('removeTrainees')?`<button class="btn btn-sm btn-danger" onclick="Views.deleteTrainee('${tr.id}')">🗑</button>`:''}
          </div></td></tr>`;
      }).join('')||`<tr><td colspan="8" class="text-center text-muted" style="padding:2rem">${t('noData')}</td></tr>`;
    };

    document.getElementById('main').innerHTML = `
      <div class="page-header">
        <div><div class="page-title">👥 ${t('trainees')}</div>
        <div class="page-subtitle">${list.length} ${t('totalTrainees')}</div></div>
        <div class="btn-group">
          <button class="btn btn-secondary" onclick="Exporter.exportTrainees()">📥 ${t('export')}</button>
          ${Auth.can('addTrainees')?`<button class="btn btn-primary" onclick="Views.openTraineeModal()">+ ${t('addTrainee')}</button>`:''}
        </div>
      </div>
      <div class="filters-bar">
        <div class="search-wrap relative">
          <span class="search-icon">🔍</span>
          <input id="trainee-search" class="form-control search-input" placeholder="${t('search')}…"
            oninput="Views._filterTrainees(this.value)">
        </div>
        <select id="trainee-grp-filter" class="form-control" onchange="Views._filterTrainees(document.getElementById('trainee-search').value)">
          <option value="">${t('all')} ${t('groups')}</option>
          ${groups.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}
        </select>
      </div>
      <div id="trainees-table" class="table-wrap"><table class="table">
        <thead><tr><th>${t('fullName')}</th><th>${t('jobId')}</th><th>${t('companyName')}</th><th>${t('mobile')}</th><th>${t('group')}</th><th>${t('specialization')}</th><th>${t('enrollmentStart')}</th><th>${t('actions')}</th></tr></thead>
        <tbody id="trainees-tbody">${renderTable(list)}</tbody>
      </table></div>`;

    Views._renderTrainees = renderTable;
    Views._allTrainees = list;
  },

  _filterTrainees(q) {
    const grpId = document.getElementById('trainee-grp-filter')?.value||'';
    const search= (q||'').toLowerCase();
    const filtered = (Views._allTrainees||[]).filter(tr=>{
      const matchQ = !search || tr.fullName.toLowerCase().includes(search) || tr.jobId.toLowerCase().includes(search) || (tr.companyName||'').toLowerCase().includes(search);
      const matchG = !grpId || tr.groupId===grpId;
      return matchQ && matchG;
    });
    const tbody = document.getElementById('trainees-tbody');
    if (tbody && Views._renderTrainees) tbody.innerHTML = Views._renderTrainees(filtered);
  },

  openTraineeModal(id) {
    const tr     = id ? DB.getTraineeById(id) : null;
    let groups   = DB.getGroups();
    const specs  = DB.getSpecializations();

    // Instructor isolation
    if (Auth.isInstructor()) {
      const instr = Auth.getCurrentInstructor();
      groups = instr ? DB.getGroupsForInstructor(instr.id) : [];
    }

    const grpOpts= groups.map(g=>{ const sp=specs.find(s=>s.id===g.specializationId)||{}; return `<option value="${g.id}" ${tr&&tr.groupId===g.id?'selected':''}>${g.name} (${sp.nameEn||''})</option>`; }).join('');
    Modal.open({
      title: tr ? t('editTrainee') : t('addTrainee'), size:'lg',
      body: `
        <div class="form-row">
          <div class="form-group"><label class="form-label">${t('fullName')} <span class="req">*</span></label><input id="tr-name" class="form-control" value="${tr?tr.fullName:''}"></div>
          <div class="form-group"><label class="form-label">${t('jobId')} <span class="req">*</span></label><input id="tr-jobid" class="form-control" value="${tr?tr.jobId:''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">${t('companyName')}</label><input id="tr-company" class="form-control" value="${tr?tr.companyName:''}"></div>
          <div class="form-group"><label class="form-label">${t('mobile')}</label><input id="tr-mobile" class="form-control" value="${tr?tr.mobile:''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">${t('email')}</label><input id="tr-email" type="email" class="form-control" value="${tr?tr.email:''}"></div>
          <div class="form-group"><label class="form-label">${t('group')} <span class="req">*</span></label><select id="tr-group" class="form-control"><option value="">— ${t('select')} —</option>${grpOpts}</select></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">${t('enrollmentStart')}</label><input id="tr-start" type="date" class="form-control" value="${tr?tr.enrollmentStart:''}"></div>
          <div class="form-group"><label class="form-label">${t('enrollmentEnd')}</label><input id="tr-end" type="date" class="form-control" value="${tr?tr.enrollmentEnd:''}"></div>
        </div>`,
      footer: `<button class="btn btn-secondary" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary" onclick="Views.saveTrainee('${id||''}')">${t('save')}</button>`,
    });
  },

  saveTrainee(id) {
    const name   = document.getElementById('tr-name').value.trim();
    const jobId  = document.getElementById('tr-jobid').value.trim();
    const company= document.getElementById('tr-company').value.trim();
    const mobile = document.getElementById('tr-mobile').value.trim();
    const email  = document.getElementById('tr-email').value.trim();
    const groupId= document.getElementById('tr-group').value;
    const start  = document.getElementById('tr-start').value;
    const end    = document.getElementById('tr-end').value;
    if (!name||!jobId||!groupId) { Toast.show(t('required'),'error'); return; }

    // Security check for instructors
    if (Auth.isInstructor()) {
      const instr = Auth.getCurrentInstructor();
      const myGroups = instr ? DB.getGroupsForInstructor(instr.id).map(g=>g.id) : [];
      if (!myGroups.includes(groupId)) { Toast.show(t('accessDenied'), 'error'); return; }
    }

    const existing = DB.getTraineeByJobId(jobId);
    if (existing && existing.id !== id) { Toast.show(t('jobIdExists'),'error'); return; }
    const data = {fullName:name,jobId,companyName:company,mobile,email,groupId,enrollmentStart:start,enrollmentEnd:end};
    if (id) DB.updateTrainee(id,data); else DB.addTrainee(data);
    Modal.close(); Toast.show(t('saved')); Router.refresh();
  },

  deleteTrainee(id) {
    // Security check for instructors
    if (Auth.isInstructor()) {
      const tr = DB.getTraineeById(id);
      const instr = Auth.getCurrentInstructor();
      const myGroups = instr ? DB.getGroupsForInstructor(instr.id).map(g=>g.id) : [];
      if (!tr || !myGroups.includes(tr.groupId)) { Toast.show(t('accessDenied'), 'error'); return; }
    }
    Modal.confirm(t('deleteTraineeConfirm'),()=>{ DB.deleteTrainee(id); Toast.show(t('deleted')); Router.refresh(); });
  },

  // ---- Instructor Portal ----
  portal() {
    const instr = Auth.getCurrentInstructor();
    if (!instr) { document.getElementById('main').innerHTML=`<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">No instructor profile linked</div></div>`; return; }
    const groups = DB.getGroupsForInstructor(instr.id);
    const specs  = DB.getSpecializations();
    const cards  = groups.map(g=>{
      const spec = specs.find(s=>s.id===g.specializationId)||{};
      const cnt  = DB.getTraineesByGroup(g.id).length;
      const isP1 = g.p1 && g.p1.instructorId === instr.id;
      const isP2 = g.p2 && g.p2.instructorId === instr.id;
      const p1Info = g.p1 ? `<span class="schedule-tag" style="${isP1?'border:1px solid var(--primary);box-shadow:0 0 8px var(--primary-glow)':''}">1️⃣ ${g.p1.startTime}-${g.p1.endTime}</span>` : '';
      const p2Info = g.p2 ? `<span class="schedule-tag" style="${isP2?'border:1px solid var(--primary);box-shadow:0 0 8px var(--primary-glow)':''}">2️⃣ ${g.p2.startTime}-${g.p2.endTime}</span>` : '';

      const now  = new Date(); const m=now.getMonth()+1; const y=now.getFullYear();
      return `<div class="group-card" onclick="">
        <div><div class="group-card-title">${g.name}</div><div class="group-card-spec">${spec.nameEn||''}</div></div>
        <div class="group-card-meta">
          <div class="group-card-meta-item">👥 ${cnt} ${t('trainees')}</div>
          <div class="group-card-meta-item">📅 ${g.startDate||'—'} → ${g.endDate||'—'}</div>
        </div>
        <div class="schedule-tags">${p1Info} ${p2Info}</div>
        <div class="btn-group mt-3">
          <button class="btn btn-primary btn-sm" onclick="Router.go('attendance',{groupId:'${g.id}',month:${m},year:${y}})">📋 ${t('attendance')}</button>
          <button class="btn btn-secondary btn-sm" onclick="Router.go('evaluations',{groupId:'${g.id}',month:${m},year:${y}})">📝 ${t('evaluations')}</button>
        </div>
      </div>`;
    }).join('');
    document.getElementById('main').innerHTML = `
      <div class="page-header"><div><div class="page-title">👋 ${t('myGroups')}</div>
        <div class="page-subtitle">${instr.fullName}</div></div></div>
      ${groups.length ? `<div class="grid-auto">${cards}</div>` : `<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-title">${t('noData')}</div></div>`}`;
  },

  // ---- Attendance View ----
  attendance(params={}) {
    const allGroups = Auth.isInstructor()
      ? DB.getGroupsForInstructor((Auth.getCurrentInstructor()||{}).id||'')
      : DB.getGroups();
    const now   = new Date();
    const grpId = params.groupId || (allGroups[0]||{}).id || '';
    const month = params.month   || (now.getMonth()+1);
    const year  = params.year    || now.getFullYear();
    const grpOpts = allGroups.map(g=>`<option value="${g.id}" ${g.id===grpId?'selected':''}>${g.name}</option>`).join('');

    document.getElementById('main').innerHTML = `
      <div class="page-header">
        <div><div class="page-title">📋 ${t('attendanceSheet')}</div></div>
        <div class="btn-group">
          <button class="btn btn-secondary" onclick="Attendance.markAllPresent(document.getElementById('att-group').value,parseInt(document.getElementById('att-year').value),parseInt(document.getElementById('att-month').value))">✅ ${t('markAll')}</button>
          <button class="btn btn-ghost" onclick="Attendance.clearAll(document.getElementById('att-group').value,parseInt(document.getElementById('att-year').value),parseInt(document.getElementById('att-month').value))">🗑 ${t('clearAll')}</button>
          <button class="btn btn-secondary" onclick="Exporter.exportAttendance(document.getElementById('att-group').value,parseInt(document.getElementById('att-year').value),parseInt(document.getElementById('att-month').value))">📥 ${t('export')}</button>
        </div>
      </div>
      <div class="filters-bar">
        <select id="att-group" class="form-control" onchange="Views._reloadAtt()">${grpOpts}</select>
        <select id="att-month" class="form-control" onchange="Views._reloadAtt()">${Attendance.monthOptions(month)}</select>
        <select id="att-year" class="form-control" onchange="Views._reloadAtt()">${Attendance.yearOptions(year)}</select>
      </div>
      <div class="card" style="padding:0">
        <div id="att-sheet" class="att-wrap">${Attendance.render(grpId,year,month)}</div>
      </div>
      <div class="card mt-4" style="padding:1rem">
        <div class="stats-legend">
          <div class="legend-item"><div class="legend-dot" style="background:var(--status-p)"></div>${t('statusPresent')}</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--status-a)"></div>${t('statusAbsent')}</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--status-e)"></div>${t('statusExcused')}</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--status-h)"></div>${t('statusHalf')}</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--status-l)"></div>${t('statusLate')}</div>
          <div class="text-muted text-sm" style="margin-left:auto">💡 Click a cell to cycle status</div>
        </div>
      </div>`;
  },

  _reloadAtt() {
    const g = document.getElementById('att-group')?.value;
    const m = parseInt(document.getElementById('att-month')?.value);
    const y = parseInt(document.getElementById('att-year')?.value);
    const sheet = document.getElementById('att-sheet');
    if (sheet && g && m && y) sheet.innerHTML = Attendance.render(g,y,m);
  },

  // ---- Evaluations View ----
  evaluations(params={}) {
    const allGroups = Auth.isInstructor()
      ? DB.getGroupsForInstructor((Auth.getCurrentInstructor()||{}).id||'')
      : DB.getGroups();
    const now   = new Date();
    const grpId = params.groupId || (allGroups[0]||{}).id || '';
    const month = params.month   || (now.getMonth()+1);
    const year  = params.year    || now.getFullYear();
    const ym    = `${year}-${String(month).padStart(2,'0')}`;
    const grpOpts = allGroups.map(g=>`<option value="${g.id}" ${g.id===grpId?'selected':''}>${g.name}</option>`).join('');

    document.getElementById('main').innerHTML = `
      <div class="page-header">
        <div><div class="page-title">📝 ${t('evaluationsTitle')}</div></div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="Evaluations.saveAll(document.getElementById('eval-group').value,'${ym}')">💾 ${t('saveEvaluations')}</button>
          <button class="btn btn-secondary" onclick="Exporter.exportEvaluations(document.getElementById('eval-group').value,'${ym}')">📥 ${t('export')}</button>
        </div>
      </div>
      <div class="filters-bar">
        <select id="eval-group" class="form-control" onchange="Views._reloadEval()">${grpOpts}</select>
        <select id="eval-month" class="form-control" onchange="Views._reloadEval()">${Attendance.monthOptions(month)}</select>
        <select id="eval-year" class="form-control" onchange="Views._reloadEval()">${Attendance.yearOptions(year)}</select>
      </div>
      <div class="card" style="padding:0;overflow:hidden">
        <div id="eval-sheet">${Evaluations.render(grpId,ym)}</div>
      </div>`;
  },

  _reloadEval() {
    const g  = document.getElementById('eval-group')?.value;
    const m  = parseInt(document.getElementById('eval-month')?.value);
    const y  = parseInt(document.getElementById('eval-year')?.value);
    const ym = `${y}-${String(m).padStart(2,'0')}`;
    const sheet = document.getElementById('eval-sheet');
    if (sheet && g) sheet.innerHTML = Evaluations.render(g,ym);
    document.querySelectorAll('.btn-primary[onclick*=saveAll]').forEach(b=>b.setAttribute('onclick',`Evaluations.saveAll(document.getElementById('eval-group').value,'${ym}')`));
  },
});
