/* =====================================================
   ACADEMIC AFFAIRS — Main App Controller (Views Part 1)
   ===================================================== */

const Views = {

  // ---- Login ----
  login() {
    const el = document.getElementById('login-form-error');
    if (el) el.textContent = '';
  },

  // ---- Dashboard ----
  dashboard() {
    if (!Auth.isAdminOrSupervisor()) { Router.go('portal'); return; }
    Charts.destroyAll();
    const specs    = DB.getSpecializations().length;
    const groups   = DB.getGroups().length;
    const instrs   = DB.getInstructors().length;
    const trainees = DB.getTrainees().length;
    const att      = DB.getAttendance();
    const pCount   = att.filter(a=>a.status==='P').length;
    const attPct   = att.length ? Math.round((pCount/att.length)*100) : 0;

    document.getElementById('main').innerHTML = `
      <div class="page-header">
        <div><div class="page-title">📊 ${t('dashboardTitle')}</div>
        <div class="page-subtitle">${new Date().toLocaleDateString(currentLang==='ar'?'ar-SA':'en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div></div>
      </div>
      <div class="grid-4" style="margin-bottom:1.5rem">
        <div class="kpi-card" style="--kpi-color:#4F46E5;--kpi-bg:rgba(79,70,229,.15)">
          <div class="kpi-icon">👨‍🏫</div>
          <div class="kpi-content"><div class="kpi-value">${instrs}</div><div class="kpi-label">${t('totalInstructors')}</div></div>
        </div>
        <div class="kpi-card" style="--kpi-color:#06B6D4;--kpi-bg:rgba(6,182,212,.15)">
          <div class="kpi-icon">👥</div>
          <div class="kpi-content"><div class="kpi-value">${trainees}</div><div class="kpi-label">${t('totalTrainees')}</div></div>
        </div>
        <div class="kpi-card" style="--kpi-color:#10B981;--kpi-bg:rgba(16,185,129,.15)">
          <div class="kpi-icon">🗂️</div>
          <div class="kpi-content"><div class="kpi-value">${groups}</div><div class="kpi-label">${t('totalGroups')}</div></div>
        </div>
        <div class="kpi-card" style="--kpi-color:#F59E0B;--kpi-bg:rgba(245,158,11,.15)">
          <div class="kpi-icon">📚</div>
          <div class="kpi-content"><div class="kpi-value">${specs}</div><div class="kpi-label">${t('totalSpecializations')}</div></div>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom:1.5rem">
        <div class="card">
          <div class="card-header"><div class="card-title">🍩 ${t('overallAttendance')}</div></div>
          <div class="chart-wrap"><canvas id="chart-att-pie"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">📊 ${t('groupPerformance')}</div></div>
          <div class="chart-wrap"><canvas id="chart-group-bar"></canvas></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📈 ${t('evaluationsTitle')} Trend</div></div>
        <div class="chart-wrap"><canvas id="chart-eval-trend"></canvas></div>
      </div>`;
    setTimeout(() => {
      Charts.renderAttendancePie('chart-att-pie');
      Charts.renderGroupPerformance('chart-group-bar');
      Charts.renderEvalTrend('chart-eval-trend', null);
    }, 50);
  },

  // ---- Specializations ----
  specializations() {
    const list = DB.getSpecializations();
    const rows = list.map(s => `<tr>
      <td><strong>${s.nameEn}</strong></td><td>${s.nameAr}</td>
      <td>${s.description||'—'}</td>
      <td>${DB.getGroupsBySpec(s.id).length}</td>
      <td><div class="table-actions">
        <button class="btn btn-sm btn-secondary" onclick="Views.openSpecModal('${s.id}')">✏️ ${t('edit')}</button>
        ${Auth.can('removeSpecializations')?`<button class="btn btn-sm btn-danger" onclick="Views.deleteSpec('${s.id}')">🗑 ${t('delete')}</button>`:''}
      </div></td></tr>`).join('') || `<tr><td colspan="5" class="text-center text-muted" style="padding:2rem">${t('noData')}</td></tr>`;

    document.getElementById('main').innerHTML = `
      <div class="page-header">
        <div><div class="page-title">📚 ${t('specializations')}</div></div>
        ${Auth.can('addSpecializations')?`<button class="btn btn-primary" onclick="Views.openSpecModal()">+ ${t('addSpecialization')}</button>`:''}
      </div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${t('nameEn')}</th><th>${t('nameAr')}</th><th>${t('description')}</th><th>${t('groups')}</th><th>${t('actions')}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  },

  openSpecModal(id) {
    const s = id ? DB.getSpecById(id) : null;
    Modal.open({
      title: s ? t('editSpecialization') : t('addSpecialization'),
      body: `<div class="form-group"><label class="form-label">${t('specializationName')} <span class="req">*</span></label>
        <input id="spec-en" class="form-control" value="${s?s.nameEn:''}" placeholder="e.g. Information Technology"></div>
        <div class="form-group mt-3"><label class="form-label">${t('specializationNameAr')} <span class="req">*</span></label>
        <input id="spec-ar" class="form-control" value="${s?s.nameAr:''}" placeholder="مثال: تقنية المعلومات" dir="rtl"></div>
        <div class="form-group mt-3"><label class="form-label">${t('description')}</label>
        <textarea id="spec-desc" class="form-control">${s?s.description||'':''}</textarea></div>`,
      footer: `<button class="btn btn-secondary" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary" onclick="Views.saveSpec('${id||''}')">${t('save')}</button>`,
    });
  },

  saveSpec(id) {
    const en   = document.getElementById('spec-en').value.trim();
    const ar   = document.getElementById('spec-ar').value.trim();
    const desc = document.getElementById('spec-desc').value.trim();
    if (!en || !ar) { Toast.show(t('required'), 'error'); return; }
    if (id) DB.updateSpec(id, {nameEn:en, nameAr:ar, description:desc});
    else    DB.addSpec({nameEn:en, nameAr:ar, description:desc});
    Modal.close(); Toast.show(t('saved')); Router.refresh();
  },

  deleteSpec(id) {
    Modal.confirm(t('deleteSpecConfirm'), () => { DB.deleteSpec(id); Toast.show(t('deleted')); Router.refresh(); });
  },

  // ---- Groups ----
  groups() {
    const list  = DB.getGroups();
    const specs = DB.getSpecializations();
    const instrs= DB.getInstructors();
    const rows  = list.map(g => {
      const spec  = specs.find(s=>s.id===g.specializationId)||{};
      const count = DB.getTraineesByGroup(g.id).length;
      
      const getInstrName = (id) => { const i = instrs.find(x=>x.id===id); return i ? i.fullName : '—'; };
      const p1Str = g.p1 ? `<div class="text-sm">1️⃣ ${g.p1.startTime}-${g.p1.endTime} <br><span class="text-muted">👤 ${getInstrName(g.p1.instructorId)}</span></div>` : '—';
      const p2Str = g.p2 ? `<div class="text-sm">2️⃣ ${g.p2.startTime}-${g.p2.endTime} <br><span class="text-muted">👤 ${getInstrName(g.p2.instructorId)}</span></div>` : '—';

      return `<tr>
        <td><strong>${g.name}</strong></td>
        <td><span class="badge badge-primary">${spec.nameEn||'—'}</span></td>
        <td>${g.startDate||'—'}</td><td>${g.endDate||'—'}</td>
        <td>${p1Str}</td><td>${p2Str}</td>
        <td><span class="badge badge-info">${count}</span></td>
        <td><div class="table-actions">
          <button class="btn btn-sm btn-secondary" onclick="Views.openGroupModal('${g.id}')">✏️</button>
          ${Auth.can('removeGroups')?`<button class="btn btn-sm btn-danger" onclick="Views.deleteGroup('${g.id}')">🗑</button>`:''}
        </div></td></tr>`;
    }).join('')||`<tr><td colspan="8" class="text-center text-muted" style="padding:2rem">${t('noData')}</td></tr>`;

    document.getElementById('main').innerHTML = `
      <div class="page-header">
        <div><div class="page-title">🗂️ ${t('groups')}</div></div>
        ${Auth.can('addGroups')?`<button class="btn btn-primary" onclick="Views.openGroupModal()">+ ${t('addGroup')}</button>`:''}
      </div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${t('groupName')}</th><th>${t('specialization')}</th><th>${t('startDate')}</th><th>${t('endDate')}</th><th>${t('period1')}</th><th>${t('period2')}</th><th>${t('traineeCount')}</th><th>${t('actions')}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  },

  openGroupModal(id) {
    const g     = id ? DB.getGroupById(id) : null;
    const specs = DB.getSpecializations();
    const instrs= DB.getInstructors();
    const specOpts = specs.map(s=>`<option value="${s.id}" ${g&&g.specializationId===s.id?'selected':''}>${s.nameEn}</option>`).join('');
    
    const getInstrOpts = (selectedId) => instrs.map(i=>`<option value="${i.id}" ${selectedId===i.id?'selected':''}>${i.fullName}</option>`).join('');
    const p1 = g && g.p1 ? g.p1 : { startTime:'08:00', endTime:'12:00', instructorId:'' };
    const p2 = g && g.p2 ? g.p2 : { startTime:'13:00', endTime:'17:00', instructorId:'' };

    Modal.open({
      title: g ? t('editGroup') : t('addGroup'), size: 'lg',
      body: `
        <div class="form-row">
          <div class="form-group"><label class="form-label">${t('groupName')} <span class="req">*</span></label>
            <input id="grp-name" class="form-control" value="${g?g.name:''}"></div>
          <div class="form-group"><label class="form-label">${t('specialization')} <span class="req">*</span></label>
            <select id="grp-spec" class="form-control"><option value="">${t('select')}…</option>${specOpts}</select></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">${t('startDate')}</label>
            <input id="grp-start" type="date" class="form-control" value="${g?g.startDate:''}"></div>
          <div class="form-group"><label class="form-label">${t('endDate')}</label>
            <input id="grp-end" type="date" class="form-control" value="${g?g.endDate:''}"></div>
        </div>
        
        <div class="card mt-3" style="background:rgba(255,255,255,0.03);border:1px dashed var(--border)">
          <div class="card-title" style="font-size:.9rem;margin-bottom:1rem">1️⃣ ${t('period1')}</div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">${t('sessionStartTime')}</label>
              <input id="p1-start" type="time" class="form-control" value="${p1.startTime}"></div>
            <div class="form-group"><label class="form-label">${t('sessionEndTime')}</label>
              <input id="p1-end" type="time" class="form-control" value="${p1.endTime}"></div>
            <div class="form-group"><label class="form-label">${t('instructor1')}</label>
              <select id="p1-instr" class="form-control"><option value="">— ${t('none')} —</option>${getInstrOpts(p1.instructorId)}</select></div>
          </div>
        </div>

        <div class="card mt-3" style="background:rgba(255,255,255,0.03);border:1px dashed var(--border)">
          <div class="card-title" style="font-size:.9rem;margin-bottom:1rem">2️⃣ ${t('period2')}</div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">${t('sessionStartTime')}</label>
              <input id="p2-start" type="time" class="form-control" value="${p2.startTime}"></div>
            <div class="form-group"><label class="form-label">${t('sessionEndTime')}</label>
              <input id="p2-end" type="time" class="form-control" value="${p2.endTime}"></div>
            <div class="form-group"><label class="form-label">${t('instructor2')}</label>
              <select id="p2-instr" class="form-control"><option value="">— ${t('none')} —</option>${getInstrOpts(p2.instructorId)}</select></div>
          </div>
        </div>`,
      footer: `<button class="btn btn-secondary" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary" onclick="Views.saveGroup('${id||''}')">${t('save')}</button>`,
    });
  },

  saveGroup(id) {
    const name  = document.getElementById('grp-name').value.trim();
    const specId= document.getElementById('grp-spec').value;
    if (!name||!specId) { Toast.show(t('required'),'error'); return; }
    
    const p1 = {
      startTime: document.getElementById('p1-start').value,
      endTime: document.getElementById('p1-end').value,
      instructorId: document.getElementById('p1-instr').value
    };
    const p2 = {
      startTime: document.getElementById('p2-start').value,
      endTime: document.getElementById('p2-end').value,
      instructorId: document.getElementById('p2-instr').value
    };

    const data = { 
      name, specializationId:specId, 
      startDate: document.getElementById('grp-start').value, 
      endDate: document.getElementById('grp-end').value, 
      p1, p2,
      // Keep instructorIds for backward compatibility if needed by other logic
      instructorIds: [p1.instructorId, p2.instructorId].filter(Boolean)
    };

    if (id) DB.updateGroup(id, data); else DB.addGroup(data);
    Modal.close(); Toast.show(t('saved')); Router.refresh();
  },

  deleteGroup(id) {
    Modal.confirm(t('deleteGroupConfirm'), ()=>{ DB.deleteGroup(id); Toast.show(t('deleted')); Router.refresh(); });
  },
};
