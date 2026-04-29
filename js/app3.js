/* =====================================================
   ACADEMIC AFFAIRS — App Part 3: Reports, Users,
   Settings, and App.init()
   ===================================================== */

Object.assign(Views, {

  // ---- Report: Trainee ----
  reportTrainee() {
    document.getElementById('main').innerHTML = `
      <div class="page-header"><div><div class="page-title">🔍 ${t('traineeReportTitle')}</div></div>
        <button class="btn btn-ghost no-print" onclick="window.print()">🖨 ${t('print')}</button>
      </div>
      <div class="card mb-4 no-print">
        <div class="form-row" style="align-items:flex-end">
          <div class="form-group" style="flex:2">
            <label class="form-label">${t('searchByJobId')}</label>
            <input id="rpt-jobid" class="form-control" placeholder="e.g. EMP001" 
              oninput="Views._runTraineeReport(true)"
              onkeydown="if(event.key==='Enter')Views._runTraineeReport()">
          </div>
          <button class="btn btn-primary" onclick="Views._runTraineeReport()">🔍 ${t('generateReport')}</button>
        </div>
      </div>
      <div id="rpt-trainee-result"></div>
      <div id="rpt-trainee-actions" class="no-print"></div>`;
  },

  _runTraineeReport(isAuto = false) {
    const jobId = document.getElementById('rpt-jobid')?.value?.trim();
    const resultEl = document.getElementById('rpt-trainee-result');
    const actionsEl = document.getElementById('rpt-trainee-actions');

    if (!jobId) {
      if (!isAuto) Toast.show(t('required'), 'error');
      resultEl.innerHTML = '';
      actionsEl.innerHTML = '';
      return;
    }

    const data = Reports.generateTraineeReport(jobId);
    if (!data) {
      if (!isAuto) {
        resultEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">${t('noData')}</div>
          <p class="text-muted">No trainee found with Job ID: <strong>${jobId}</strong></p></div>`;
        actionsEl.innerHTML = '';
      }
      return;
    }

    resultEl.innerHTML = Reports.renderTraineeReport(data);
    actionsEl.innerHTML = `
      <div style="margin-top:1rem">
        <button class="btn btn-secondary" onclick="Exporter.exportTraineeReport('${jobId}')">📥 ${t('export')}</button>
      </div>`;
  },

  // ---- Report: Group ----
  reportGroup() {
    const groups = DB.getGroups();
    const specs  = DB.getSpecializations();
    const grpOpts= groups.map(g=>{ const sp=specs.find(s=>s.id===g.specializationId)||{}; return `<option value="${g.id}">${g.name} — ${sp.nameEn||''}</option>`; }).join('');
    document.getElementById('main').innerHTML = `
      <div class="page-header"><div><div class="page-title">📊 ${t('groupReportTitle')}</div></div>
        <div class="btn-group no-print">
          <button class="btn btn-secondary" onclick="Exporter.exportGroupReport(document.getElementById('rpt-grp-sel').value)">📥 ${t('export')}</button>
          <button class="btn btn-ghost" onclick="window.print()">🖨 ${t('print')}</button>
        </div>
      </div>
      <div class="card mb-4 no-print">
        <div class="form-row" style="align-items:flex-end">
          <div class="form-group" style="flex:2">
            <label class="form-label">${t('selectGroup')}</label>
            <select id="rpt-grp-sel" class="form-control"><option value="">— ${t('select')} —</option>${grpOpts}</select>
          </div>
          <button class="btn btn-primary" onclick="Views._runGroupReport()">📊 ${t('generateReport')}</button>
        </div>
      </div>
      <div id="rpt-group-result"></div>`;
  },

  _runGroupReport() {
    const gId = document.getElementById('rpt-grp-sel')?.value;
    if (!gId) { Toast.show(t('required'),'error'); return; }
    const data = Reports.generateGroupReport(gId);
    document.getElementById('rpt-group-result').innerHTML = Reports.renderGroupReport(data);
  },

  // ---- Users ----
  users() {
    if (!Auth.isAdmin()) { Toast.show(t('accessDenied'),'error'); Router.go('dashboard'); return; }
    const list  = DB.getUsers();
    const rows  = list.map(u => {
      const roleBadge = {admin:'badge-danger',instructor:'badge-info',supervisor:'badge-warning'}[u.role]||'badge-gray';
      return `<tr>
        <td><strong>${u.displayName||u.username}</strong></td>
        <td><span class="badge badge-gray">${u.username}</span></td>
        <td><span class="badge ${roleBadge}">${t('role'+u.role.charAt(0).toUpperCase()+u.role.slice(1))}</span></td>
        <td>${new Date(u.createdAt||Date.now()).toLocaleDateString()}</td>
        <td><div class="table-actions">
          <button class="btn btn-sm btn-secondary" onclick="Views.openUserModal('${u.id}')">✏️ ${t('edit')}</button>
          <button class="btn btn-sm btn-danger" onclick="Views.deleteUser('${u.id}')">🗑</button>
        </div></td></tr>`;
    }).join('')||`<tr><td colspan="5" class="text-center text-muted" style="padding:2rem">${t('noData')}</td></tr>`;

    document.getElementById('main').innerHTML = `
      <div class="page-header"><div><div class="page-title">🔐 ${t('users')}</div></div>
        <button class="btn btn-primary" onclick="Views.openUserModal()">+ ${t('addUser')}</button>
      </div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${t('fullName')}</th><th>${t('username')}</th><th>${t('role')}</th><th>${t('createdAt')}</th><th>${t('actions')}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  },

  openUserModal(id) {
    const u = id ? DB.getUserById(id) : null;
    const instrs = DB.getInstructors();
    const instrOpts = instrs.map(i=>`<option value="${i.id}" ${u&&u.instructorId===i.id?'selected':''}>${i.fullName}</option>`).join('');
    const perms = u ? u.permissions||{} : {};
    const permKeys = ['addTrainees','removeTrainees','addGroups','removeGroups','addSpecializations','removeSpecializations','viewReports','export'];
    const permHtml = permKeys.map(k=>`
      <div class="perm-item" onclick="this.querySelector('.perm-toggle').classList.toggle('on');this.querySelector('input').checked=!this.querySelector('input').checked">
        <div class="perm-toggle ${perms[k]?'on':''}"></div>
        <input type="checkbox" id="perm-${k}" ${perms[k]?'checked':''} style="display:none">
        <span class="perm-label">${t('perm'+k.charAt(0).toUpperCase()+k.slice(1))}</span>
      </div>`).join('');

    Modal.open({
      title: u ? t('editUser') : t('addUser'), size:'lg',
      body: `
        <div class="form-row">
          <div class="form-group"><label class="form-label">Display Name</label><input id="usr-dname" class="form-control" value="${u?u.displayName||'':''}"></div>
          <div class="form-group"><label class="form-label">${t('username')} <span class="req">*</span></label><input id="usr-uname" class="form-control" value="${u?u.username:''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">${t('newPassword')} ${id?'(leave blank)':''}</label><input id="usr-pass" type="password" class="form-control"></div>
          <div class="form-group"><label class="form-label">${t('role')} <span class="req">*</span></label>
            <select id="usr-role" class="form-control">
              <option value="admin" ${u&&u.role==='admin'?'selected':''}>${t('roleAdmin')}</option>
              <option value="supervisor" ${u&&u.role==='supervisor'?'selected':''}>${t('roleSupervisor')}</option>
              <option value="instructor" ${u&&u.role==='instructor'?'selected':''}>${t('roleInstructor')}</option>
            </select>
          </div>
        </div>
        <div class="form-group mt-2"><label class="form-label">${t('linkInstructor')}</label>
          <select id="usr-instr" class="form-control"><option value="">— ${t('none')} —</option>${instrOpts}</select></div>
        <div class="form-group mt-3"><label class="form-label">${t('permissions')}</label>
          <div class="perm-grid">${permHtml}</div></div>`,
      footer:`<button class="btn btn-secondary" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary" onclick="Views.saveUser('${id||''}')">${t('save')}</button>`,
    });
  },

  saveUser(id) {
    const uname= document.getElementById('usr-uname').value.trim();
    const role = document.getElementById('usr-role').value;
    const pass = document.getElementById('usr-pass').value;
    const dname= document.getElementById('usr-dname').value.trim();
    const instr= document.getElementById('usr-instr').value;
    if (!uname||!role) { Toast.show(t('required'),'error'); return; }
    if (!id && !pass)  { Toast.show(t('required'),'error'); return; }
    const permKeys = ['addTrainees','removeTrainees','addGroups','removeGroups','addSpecializations','removeSpecializations','viewReports','export'];
    const perms = {};
    permKeys.forEach(k=>{ perms[k] = !!document.getElementById(`perm-${k}`)?.checked; });
    const data = { username:uname, role, displayName:dname, permissions:perms, instructorId:instr||null, ...(pass?{passwordHash:Auth.hash(pass)}:{}) };
    if (id) DB.updateUser(id,data); else DB.addUser(data);
    Modal.close(); Toast.show(t('saved')); Router.refresh();
  },

  deleteUser(id) {
    const s = Auth.getSession();
    if (s && s.userId === id) { Toast.show('Cannot delete your own account.','error'); return; }
    Modal.confirm(t('deleteUserConfirm'),()=>{ DB.deleteUser(id); Toast.show(t('deleted')); Router.refresh(); });
  },

  // ---- Holidays ----
  holidays() {
    if (!Auth.isAdminOrSupervisor()) { Toast.show(t('accessDenied'),'error'); Router.go('dashboard'); return; }
    const list = DB.getHolidays();
    const rows = list.map(h => `<tr>
      <td><strong>${h.date}</strong></td>
      <td>${h.reason||'—'}</td>
      <td><button class="btn btn-sm btn-danger" onclick="Views.deleteHoliday('${h.id}')">🗑</button></td>
    </tr>`).join('') || `<tr><td colspan="3" class="text-center text-muted" style="padding:2rem">${t('noData')}</td></tr>`;

    document.getElementById('main').innerHTML = `
      <div class="page-header"><div><div class="page-title">📅 ${t('holidays')}</div></div>
        <button class="btn btn-primary" onclick="Views.openHolidayModal()">+ ${t('addHoliday')}</button>
      </div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${t('holidayDate')}</th><th>${t('holidayReason')}</th><th>${t('actions')}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  },

  openHolidayModal() {
    Modal.open({
      title: t('addHoliday'),
      body: `
        <div class="form-group"><label class="form-label">${t('holidayDate')} <span class="req">*</span></label>
          <input id="h-date" type="date" class="form-control"></div>
        <div class="form-group mt-3"><label class="form-label">${t('holidayReason')}</label>
          <input id="h-reason" class="form-control" placeholder="e.g. National Day"></div>`,
      footer: `<button class="btn btn-secondary" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary" onclick="Views.saveHoliday()">${t('save')}</button>`,
    });
  },

  saveHoliday() {
    const date = document.getElementById('h-date').value;
    const reason = document.getElementById('h-reason').value.trim();
    if (!date) { Toast.show(t('required'),'error'); return; }
    DB.addHoliday({ date, reason });
    Modal.close(); Toast.show(t('saved')); Router.refresh();
  },

  deleteHoliday(id) {
    Modal.confirm(t('deleteHolidayConfirm'), ()=>{ DB.deleteHoliday(id); Toast.show(t('deleted')); Router.refresh(); });
  },

  // ---- Settings ----
  settings() {
    const cfg = DB.getSettings();
    const adminPanel = Auth.isAdmin() ? `
      <div class="card mt-4">
        <div class="card-header"><div class="card-title">💾 ${t('backupTitle')}</div></div>
        <div class="p-4">
          <div class="grid-2">
            <div class="p-3" style="background:var(--bg-glass);border-radius:var(--r-md);border:1px solid var(--border)">
              <p class="text-sm text-muted mb-4">${t('backupDesc')}</p>
              <button class="btn btn-primary w-full" onclick="DB.exportBackup()">📥 ${t('backupBtn')}</button>
            </div>
            <div class="p-3" style="background:var(--bg-glass);border-radius:var(--r-md);border:1px solid var(--border)">
              <p class="text-sm text-muted mb-4">${t('restoreDesc')}</p>
              <input type="file" id="restore-file" style="display:none" onchange="Views._handleRestore(this)">
              <button class="btn btn-secondary w-full" onclick="document.getElementById('restore-file').click()">📤 ${t('restoreBtn')}</button>
            </div>
          </div>
        </div>
      </div>
    ` : '';

    document.getElementById('main').innerHTML = `
      <div class="page-header"><div><div class="page-title">⚙️ ${t('settingsTitle')}</div></div></div>
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><div class="card-title">🕐 ${t('workingHours')}</div></div>
          <div class="form-group"><label class="form-label">${t('workingHoursStart')}</label>
            <input id="cfg-start" type="time" class="form-control" value="${cfg.workingHoursStart||'08:00'}"></div>
          <div class="form-group mt-3"><label class="form-label">${t('workingHoursEnd')}</label>
            <input id="cfg-end" type="time" class="form-control" value="${cfg.workingHoursEnd||'20:00'}"></div>
          <button class="btn btn-primary mt-4" onclick="Views._saveSettings()">💾 ${t('saveSettings')}</button>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">🌐 ${t('language')}</div></div>
          <div class="btn-group">
            <button class="btn ${currentLang==='en'?'btn-primary':'btn-secondary'}" onclick="setLang('en');Router.refresh()">🇬🇧 ${t('languageEn')}</button>
            <button class="btn ${currentLang==='ar'?'btn-primary':'btn-secondary'}" onclick="setLang('ar');Router.refresh()">🇸🇦 ${t('languageAr')}</button>
          </div>
          <div class="card mt-4" style="background:var(--bg-glass)">
            <div class="card-title mb-2">ℹ️ ${t('systemInfo')}</div>
            <div class="text-sm text-muted">${t('version')}: ${cfg.version||'2.0.0'}</div>
            <div class="text-sm text-muted mt-1">Total Trainees: ${DB.getTrainees().length}</div>
            <div class="text-sm text-muted mt-1">Total Attendance Records: ${DB.getAttendance().length}</div>
            <div class="text-sm text-muted mt-1">Total Evaluations: ${DB.getEvaluations().length}</div>
          </div>
        </div>
      </div>
      ${adminPanel}`;
  },

  _handleRestore(input) {
    const file = input.files ? input.files[0] : null;
    if (!file) return;

    Modal.confirm(t('restoreConfirm'), () => {
      DB.importBackup(file)
        .then(() => {
          Toast.show(t('restoreSuccess'), 'success');
          setTimeout(() => location.reload(), 1500);
        })
        .catch(err => {
          console.error('Restore failed:', err);
          Toast.show(`${t('restoreError')} [${err.message}]`, 'error');
        });
    });
    input.value = ''; // Reset
  },

  _saveSettings() {
    const start = document.getElementById('cfg-start').value;
    const end   = document.getElementById('cfg-end').value;
    DB.saveSettings({ ...DB.getSettings(), workingHoursStart:start, workingHoursEnd:end });
    Toast.show(t('settingsSaved'));
  },

  updateClock() {
    const el = document.getElementById('digital-clock');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  },
});

// =====================================================
// App Bootstrap
// =====================================================
const App = {
  init() {
    DB.seed();
    applyLang();

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const u = document.getElementById('login-username').value.trim();
        const p = document.getElementById('login-password').value.trim();
        const session = Auth.login(u, p);
        if (!session) {
          document.getElementById('login-form-error').textContent = t('loginError');
          return;
        }
        Router.go(session.role === 'instructor' ? 'portal' : 'dashboard');
      });
    }

    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      Auth.logout(); Charts.destroyAll(); Router.go('login');
    });

    // Language toggle in header
    document.getElementById('btn-lang')?.addEventListener('click', () => {
      setLang(currentLang === 'en' ? 'ar' : 'en');
      Router.refresh();
    });

    // Sidebar nav
    document.querySelectorAll('.sidebar-nav-item[data-view]').forEach(el => {
      el.addEventListener('click', () => {
        Router.go(el.dataset.view);
        document.getElementById('sidebar')?.classList.remove('open');
      });
    });

    // Modal overlay click to close
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'modal-overlay') Modal.close();
    });

    // Initial route
    if (Auth.isLoggedIn()) {
      Router.go(Auth.isInstructor() ? 'portal' : 'dashboard');
    } else {
      Router.go('login');
    }

    // Clock
    Views.updateClock();
    setInterval(() => Views.updateClock(), 1000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
