/* =====================================================
   ACADEMIC AFFAIRS — SPA Router & Toast Utility
   ===================================================== */

// ---- Toast Notification ----
const Toast = {
  show(msg, type = 'success', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span style="font-size:1.1rem">${icons[type]||'ℹ'}</span><span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'slideOut .3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }
};

// ---- Modal ----
const Modal = {
  open({ title = '', body = '', footer = '', size = '' } = {}) {
    const overlay = document.getElementById('modal-overlay');
    const modal   = document.getElementById('modal');
    if (!overlay || !modal) return;
    modal.className = `modal${size ? ' modal-' + size : ''}`;
    modal.innerHTML = `
      <div class="modal-header">
        <span class="modal-title">${title}</span>
        <button class="modal-close" onclick="Modal.close()">✕</button>
      </div>
      <div class="modal-body">${body}</div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    `;
    overlay.classList.remove('hidden');
    // Focus first input
    setTimeout(() => { const inp = modal.querySelector('input,select,textarea'); if(inp) inp.focus(); }, 50);
  },
  close() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.add('hidden');
  },
  confirm(msg, onConfirm) {
    this.open({
      title: t('confirm'), size: 'sm',
      body: `<p style="color:var(--text-2);line-height:1.7">${msg}</p>`,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-danger" id="modal-confirm-btn">${t('yes')}</button>
      `,
    });
    document.getElementById('modal-confirm-btn').onclick = () => { Modal.close(); onConfirm(); };
  },
};

// ---- Router ----
const Router = {
  currentView: null,
  currentParams: {},

  routes: {
    login: () => Views.login(),
    dashboard: () => Views.dashboard(),
    specializations: () => Views.specializations(),
    groups: () => Views.groups(),
    instructors: () => Views.instructors(),
    trainees: () => Views.trainees(),
    users: () => Views.users(),
    settings: () => Views.settings(),
    holidays: () => Views.holidays(),
    'reports/trainee': () => Views.reportTrainee(),
    'reports/group': () => Views.reportGroup(),
    portal: () => Views.portal(),
    attendance: (p) => Views.attendance(p),
    evaluations: (p) => Views.evaluations(p),
  },

  go(view, params = {}) {
    if (!Auth.isLoggedIn() && view !== 'login') { this.go('login'); return; }
    if (view === 'login' && Auth.isLoggedIn()) { this.go(Auth.isInstructor() ? 'portal' : 'dashboard'); return; }

    this.currentView   = view;
    this.currentParams = params;

    const handler = this.routes[view];
    if (!handler) { console.warn('No route for', view); return; }

    // Switch UI panels
    const loginScreen = document.getElementById('login-screen');
    const appShell    = document.getElementById('app-shell');
    if (view === 'login') {
      loginScreen?.classList.remove('hidden');
      appShell?.classList.add('hidden');
    } else {
      loginScreen?.classList.add('hidden');
      appShell?.classList.remove('hidden');
      this.updateNav(view);
      this.updateHeader();
    }

    // Render view into #main
    if (view !== 'login') {
      const main = document.getElementById('main');
      if (main) main.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--text-2)">Loading…</div>';
    }

    setTimeout(() => handler(params), 10);
  },

  updateNav(view) {
    document.querySelectorAll('.sidebar-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === view || view.startsWith(el.dataset.view + '/'));
    });
  },

  updateHeader() {
    const session = Auth.getSession();
    const titleEl = document.getElementById('header-title');
    const userEl  = document.getElementById('header-user-name');
    if (titleEl) titleEl.textContent = t(this.currentView?.replace('/', '') || 'dashboard');
    if (userEl && session) userEl.textContent = session.displayName || session.userId;
    // Role badge
    const roleEl = document.getElementById('header-role');
    if (roleEl && session) roleEl.textContent = session.role;
  },

  // Re-render current view
  refresh() { this.go(this.currentView, this.currentParams); },
};
