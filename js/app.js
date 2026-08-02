// ============================================================
// App — router hash-based + shell (sidebar + topbar)
// ============================================================
import { store } from './core/store.js';
import { toast, esc, closeAllDropdowns } from './core/ui.js';
import { login } from './views/login.js';
import { dashboard } from './views/dashboard.js';
import { forms } from './views/forms.js';
import { users } from './views/users.js';
import { components } from './views/components.js';
import { wizard } from './views/wizard.js';
import { settings } from './views/settings.js';

const appEl = document.getElementById('app');

// Navegación de la barra lateral (con submenús).
const NAV = [
  { type: 'link', path: '/dashboard', icon: '📊', label: 'Dashboard', testid: 'nav-dashboard' },
  { type: 'link', path: '/forms', icon: '📝', label: 'Formularios', testid: 'nav-forms' },
  {
    type: 'group', icon: '🗂️', label: 'Gestión', testid: 'nav-management',
    children: [
      { path: '/users', label: 'Usuarios', testid: 'nav-users', badge: null },
      { path: '/wizard', label: 'Asistente', testid: 'nav-wizard' },
    ],
  },
  {
    type: 'group', icon: '🧩', label: 'Componentes', testid: 'nav-components-group',
    children: [
      { path: '/components', label: 'UI e interacciones', testid: 'nav-components' },
    ],
  },
  { type: 'link', path: '/settings', icon: '⚙️', label: 'Configuración', testid: 'nav-settings' },
];

const ROUTES = {
  '/login': login,
  '/dashboard': dashboard,
  '/forms': forms,
  '/users': users,
  '/components': components,
  '/wizard': wizard,
  '/settings': settings,
};

const PAGE_TITLES = {
  '/dashboard': 'Dashboard', '/forms': 'Formularios', '/users': 'Usuarios',
  '/components': 'Componentes', '/wizard': 'Asistente', '/settings': 'Configuración',
};

function currentPath() {
  const hash = location.hash.replace(/^#/, '');
  return hash || (store.auth.isLoggedIn ? '/dashboard' : '/login');
}

function navigate(path) {
  if (location.hash === '#' + path) { render(); }
  else location.hash = path;
}

function setTheme(theme) {
  store.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
}

const ctx = { navigate, setTheme, store };

// ---------- Render principal ----------
function render() {
  let path = currentPath();

  // Guardas de autenticación.
  if (!store.auth.isLoggedIn && path !== '/login') { location.hash = '/login'; return; }
  if (store.auth.isLoggedIn && path === '/login') { location.hash = '/dashboard'; return; }

  const view = ROUTES[path] || dashboard;

  if (view.fullscreen) {
    appEl.innerHTML = view.render(ctx);
    view.mount && view.mount(appEl, ctx);
    return;
  }

  appEl.innerHTML = shell(path);
  const content = appEl.querySelector('#view-content');
  content.innerHTML = view.render(ctx);
  view.mount && view.mount(content, ctx);
  wireShell(path);
}

// ---------- Shell (layout con sidebar + topbar) ----------
function shell(path) {
  const u = store.auth.user || { name: 'Invitado', email: '', initials: 'IN', role: '' };
  return `
  <div class="layout ${store.sidebarCollapsed ? 'collapsed' : ''}" data-testid="app-layout">
    <aside class="sidebar" data-testid="sidebar">
      <div class="sidebar__brand"><span class="logo">🎭</span> <span class="brand-text">Playwright Demo</span></div>
      <nav class="nav" data-testid="nav">
        <div class="nav__group-title">Menú</div>
        ${NAV.map(item => navItem(item, path)).join('')}
      </nav>
      <div style="padding:14px">
        <button class="nav__item" data-testid="nav-logout"><span class="nav__icon">🚪</span> <span class="nav__text">Cerrar sesión</span></button>
      </div>
    </aside>

    <div class="main">
      <header class="topbar" data-testid="topbar">
        <button class="topbar__toggle" data-testid="sidebar-toggle" aria-label="Alternar menú">☰</button>
        <div class="topbar__search"><input type="search" placeholder="Buscar en la aplicación…" data-testid="global-search" /></div>
        <div class="topbar__spacer"></div>
        <div class="topbar__actions">
          <button class="icon-btn" data-testid="theme-toggle" aria-label="Cambiar tema">${store.theme === 'dark' ? '☀️' : '🌙'}</button>

          <div class="dropdown">
            <button class="icon-btn" data-testid="notifications-btn" aria-label="Notificaciones">🔔<span class="dot"></span></button>
            <div class="dropdown__menu" data-testid="notifications-menu">
              <div class="dropdown__header"><strong>Notificaciones</strong> <span class="badge badge--danger" style="margin-left:6px">3 nuevas</span></div>
              <div class="dropdown__notif"><span class="n-icon">✅</span><div><div class="n-title">Registro completado</div><div class="n-time">Hace 5 min</div></div></div>
              <div class="dropdown__notif"><span class="n-icon">⚠️</span><div><div class="n-title">Límite de uso al 80%</div><div class="n-time">Hace 1 h</div></div></div>
              <div class="dropdown__notif"><span class="n-icon">📦</span><div><div class="n-title">Nuevo pedido recibido</div><div class="n-time">Hace 2 h</div></div></div>
            </div>
          </div>

          <div class="dropdown">
            <button class="icon-btn" data-testid="user-menu-btn" style="width:auto;gap:8px;padding:0 6px" aria-label="Menú de usuario">
              <span class="avatar">${esc(u.initials)}</span>
            </button>
            <div class="dropdown__menu" data-testid="user-menu">
              <div class="dropdown__header"><strong>${esc(u.name)}</strong><div class="text-soft" style="font-size:12px">${esc(u.email)}</div></div>
              <button class="dropdown__item" data-nav="/settings" data-testid="menu-profile">👤 Mi perfil</button>
              <button class="dropdown__item" data-nav="/settings" data-testid="menu-settings">⚙️ Configuración</button>
              <div class="divider" style="margin:6px 0"></div>
              <button class="dropdown__item danger" data-testid="menu-logout">🚪 Cerrar sesión</button>
            </div>
          </div>
        </div>
      </header>

      <main class="content" id="view-content" data-testid="view-content" data-route="${esc(path)}"></main>
    </div>
  </div>`;
}

function navItem(item, path) {
  if (item.type === 'link') {
    return `<button class="nav__item ${path === item.path ? 'active' : ''}" data-nav="${item.path}" data-testid="${item.testid}">
      <span class="nav__icon">${item.icon}</span> <span class="nav__text">${item.label}</span>
    </button>`;
  }
  // group con submenú
  const childActive = item.children.some(c => c.path === path);
  return `
    <button class="nav__item ${childActive ? 'open' : ''}" data-submenu="${item.testid}" data-testid="${item.testid}">
      <span class="nav__icon">${item.icon}</span> <span class="nav__text">${item.label}</span>
      <span class="nav__caret">▸</span>
    </button>
    <div class="nav__submenu ${childActive ? 'open' : ''}" data-submenu-for="${item.testid}">
      ${item.children.map(c => `
        <button class="nav__subitem ${path === c.path ? 'active' : ''}" data-nav="${c.path}" data-testid="${c.testid}">${c.label}</button>`).join('')}
    </div>`;
}

// ---------- Wiring del shell ----------
function wireShell(path) {
  // Navegación.
  appEl.querySelectorAll('[data-nav]').forEach(el =>
    el.addEventListener('click', () => { navigate(el.getAttribute('data-nav')); closeAllDropdowns(); }));

  // Submenús.
  appEl.querySelectorAll('[data-submenu]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-submenu');
      const sub = appEl.querySelector(`[data-submenu-for="${key}"]`);
      btn.classList.toggle('open');
      sub.classList.toggle('open');
    });
  });

  // Colapsar sidebar.
  appEl.querySelector('[data-testid="sidebar-toggle"]').addEventListener('click', () => {
    if (window.innerWidth <= 760) appEl.querySelector('.layout').classList.toggle('mobile-open');
    else { store.sidebarCollapsed = !store.sidebarCollapsed; appEl.querySelector('.layout').classList.toggle('collapsed'); }
  });

  // Tema.
  appEl.querySelector('[data-testid="theme-toggle"]').addEventListener('click', () => {
    setTheme(store.theme === 'dark' ? 'light' : 'dark');
    appEl.querySelector('[data-testid="theme-toggle"]').textContent = store.theme === 'dark' ? '☀️' : '🌙';
  });

  // Dropdowns.
  const toggleDropdown = (btnSel, menuSel) => {
    const btn = appEl.querySelector(btnSel);
    const menu = appEl.querySelector(menuSel);
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) menu.classList.add('open');
    });
  };
  toggleDropdown('[data-testid="notifications-btn"]', '[data-testid="notifications-menu"]');
  toggleDropdown('[data-testid="user-menu-btn"]', '[data-testid="user-menu"]');
  document.addEventListener('click', () => closeAllDropdowns());

  // Logout.
  const doLogout = () => { store.logout(); toast('Sesión cerrada.', 'info', 'Hasta pronto'); navigate('/login'); };
  appEl.querySelector('[data-testid="nav-logout"]').addEventListener('click', doLogout);
  appEl.querySelector('[data-testid="menu-logout"]').addEventListener('click', doLogout);

  // Búsqueda global (demo).
  appEl.querySelector('[data-testid="global-search"]').addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.value.trim()) toast(`Buscando: "${e.target.value.trim()}"…`, 'info', 'Búsqueda');
  });
}

// ---------- Bootstrap ----------
window.addEventListener('hashchange', render);
setTheme(store.theme);
render();
