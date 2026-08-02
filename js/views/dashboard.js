// ============================================================
// Vista: Dashboard
// ============================================================
import { store } from '../core/store.js';
import { esc } from '../core/ui.js';

const STATS = [
  { label: 'Usuarios totales', value: '2,431', delta: '+12.5%', up: true, icon: '👥', bg: 'var(--primary-soft)' },
  { label: 'Ingresos', value: '$48,290', delta: '+8.2%', up: true, icon: '💰', bg: 'var(--success-soft)' },
  { label: 'Pedidos', value: '1,204', delta: '-3.1%', up: false, icon: '📦', bg: 'var(--warning-soft)' },
  { label: 'Tasa de rebote', value: '24.8%', delta: '-1.4%', up: true, icon: '📊', bg: 'var(--info-soft)' },
];

const CHART = [
  { label: 'Ene', v: 45 }, { label: 'Feb', v: 62 }, { label: 'Mar', v: 51 },
  { label: 'Abr', v: 78 }, { label: 'May', v: 66 }, { label: 'Jun', v: 92 }, { label: 'Jul', v: 84 },
];

const ACTIVITY = [
  { icon: '✅', bg: 'var(--success-soft)', text: '<b>Ana García</b> completó el registro', time: 'Hace 5 min' },
  { icon: '📝', bg: 'var(--info-soft)', text: '<b>Carlos López</b> actualizó su perfil', time: 'Hace 22 min' },
  { icon: '⚠️', bg: 'var(--warning-soft)', text: 'Advertencia de uso en el plan gratuito', time: 'Hace 1 h' },
  { icon: '🗑️', bg: 'var(--danger-soft)', text: '<b>María Ruiz</b> eliminó un documento', time: 'Hace 3 h' },
];

export const dashboard = {
  render() {
    const max = Math.max(...CHART.map(c => c.v));
    return `
    <div data-testid="dashboard-page">
      <div class="page-head">
        <div class="breadcrumb"><span>Inicio</span><span>Dashboard</span></div>
        <h1 data-testid="page-title">Dashboard</h1>
        <p>Resumen general de la actividad de tu cuenta.</p>
      </div>

      <div class="grid cols-4" data-testid="stats-grid">
        ${STATS.map((s, i) => `
          <div class="stat" data-testid="stat-card-${i}">
            <div class="stat__icon" style="background:${s.bg}">${s.icon}</div>
            <div>
              <div class="stat__label">${esc(s.label)}</div>
              <div class="stat__value" data-testid="stat-value-${i}">${esc(s.value)}</div>
              <div class="stat__delta ${s.up ? 'up' : 'down'}">${s.up ? '▲' : '▼'} ${esc(s.delta)}</div>
            </div>
          </div>`).join('')}
      </div>

      <div class="grid cols-3 mt-24" style="grid-template-columns: 2fr 1fr">
        <div class="card">
          <div class="card__head">
            <h3>Ingresos por mes</h3>
            <span class="badge badge--success" style="margin-left:auto"><span class="dot-s"></span> En vivo</span>
          </div>
          <div class="card__body">
            <div class="bar-chart" data-testid="bar-chart">
              ${CHART.map(c => `
                <div class="bar-col" data-testid="bar-${c.label}">
                  <div class="bar" style="height:${Math.round((c.v / max) * 100)}%" title="${c.v}k"></div>
                  <div class="bar-label">${c.label}</div>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__head"><h3>Actividad reciente</h3></div>
          <div class="card__body" style="padding-top:6px" data-testid="activity-feed">
            ${ACTIVITY.map(a => `
              <div class="activity-item">
                <div class="activity-dot" style="background:${a.bg}">${a.icon}</div>
                <div>
                  <div>${a.text}</div>
                  <div class="text-soft" style="font-size:12px">${a.time}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="card mt-24">
        <div class="card__head">
          <h3>Últimos usuarios</h3>
          <a class="btn btn--ghost btn--sm" data-nav="/users" style="margin-left:auto" data-testid="goto-users">Ver todos →</a>
        </div>
        <div class="card__body" style="padding:0">
          <div class="table-wrap">
            <table class="table" data-testid="recent-users-table">
              <thead><tr><th>Usuario</th><th>Rol</th><th>Departamento</th><th>Estado</th></tr></thead>
              <tbody>
                ${store.users.slice(0, 5).map(u => `
                  <tr>
                    <td><div class="cell-user"><span class="avatar sm">${esc(u.name.split(' ').map(n => n[0]).join(''))}</span> ${esc(u.name)}</div></td>
                    <td>${esc(u.role)}</td>
                    <td>${esc(u.department)}</td>
                    <td>${statusBadge(u.status)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;
  },

  mount(root, { navigate }) {
    root.querySelectorAll('[data-nav]').forEach(el =>
      el.addEventListener('click', () => navigate(el.getAttribute('data-nav'))));
    // Animación de barras al montar.
    requestAnimationFrame(() => {
      root.querySelectorAll('.bar').forEach(b => { const h = b.style.height; b.style.height = '0%'; requestAnimationFrame(() => b.style.height = h); });
    });
  },
};

function statusBadge(status) {
  const map = { 'Activo': 'success', 'Inactivo': 'danger', 'Pendiente': 'warning' };
  const t = map[status] || 'neutral';
  return `<span class="badge badge--${t}"><span class="dot-s"></span> ${esc(status)}</span>`;
}

export { statusBadge };
