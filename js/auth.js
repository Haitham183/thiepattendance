/* =====================================================
   ACADEMIC AFFAIRS — Authentication & RBAC
   ===================================================== */

const Auth = {
  SESSION_KEY: 'aa_session',

  // Simple hash (base64 for demo — swap with bcrypt in production)
  hash(pwd)   { return btoa(pwd); },
  verify(pwd, hash) { return btoa(pwd) === hash; },

  login(username, password) {
    const user = DB.getUserByUsername(username);
    if (!user) return false;
    if (!this.verify(password, user.passwordHash)) return false;
    const session = { userId: user.id, role: user.role, displayName: user.displayName || user.username, loginAt: Date.now() };
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },

  getSession() {
    try {
      const raw = sessionStorage.getItem(this.SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  isLoggedIn() { return !!this.getSession(); },

  getRole() {
    const s = this.getSession();
    return s ? s.role : null;
  },

  getCurrentUser() {
    const s = this.getSession();
    if (!s) return null;
    return DB.getUserById(s.userId);
  },

  getCurrentInstructor() {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'instructor') return null;
    return DB.getInstructorByUserId(user.id) || null;
  },

  // Permissions
  can(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin') return true; // admin has all
    return !!(user.permissions && user.permissions[permission]);
  },

  isAdmin()      { return this.getRole() === 'admin'; },
  isInstructor() { return this.getRole() === 'instructor'; },
  isSupervisor() { return this.getRole() === 'supervisor'; },
  isAdminOrSupervisor() {
    const r = this.getRole();
    return r === 'admin' || r === 'supervisor';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      Router.go('login');
      return false;
    }
    return true;
  },

  requireAdmin() {
    if (!this.isAdminOrSupervisor()) {
      Toast.show(t('accessDenied'), 'error');
      return false;
    }
    return true;
  },
};
