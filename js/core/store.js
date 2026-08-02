// ============================================================
// Store — estado en memoria (sin persistencia real).
// ============================================================

const firstNames = ['Ana', 'Luis', 'María', 'Carlos', 'Sofía', 'Diego', 'Elena', 'Javier',
  'Lucía', 'Pablo', 'Marta', 'Andrés', 'Carmen', 'Raúl', 'Isabel', 'Fernando', 'Paula', 'Hugo'];
const lastNames = ['García', 'Martínez', 'López', 'Sánchez', 'Pérez', 'Gómez', 'Ruiz', 'Díaz',
  'Torres', 'Ramírez', 'Flores', 'Romero', 'Vargas', 'Castro', 'Ortiz'];
const roles = ['Administrador', 'Editor', 'Visualizador', 'Gerente'];
const statuses = ['Activo', 'Inactivo', 'Pendiente'];
const departments = ['Ventas', 'Ingeniería', 'Soporte', 'Marketing', 'Finanzas'];

// Normaliza acentos para generar correos limpios.
const deaccent = s => s.toLowerCase().replace(/[íáéóúñ]/g, m => ({ í: 'i', á: 'a', é: 'e', ó: 'o', ú: 'u', ñ: 'n' }[m]));

// Generador determinista (sin Math.random para reproducibilidad en pruebas).
function seededUsers(n) {
  const users = [];
  for (let i = 0; i < n; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const role = roles[i % roles.length];
    const status = statuses[i % statuses.length];
    const dept = departments[(i * 2) % departments.length];
    users.push({
      id: i + 1,
      name: `${fn} ${ln}`,
      email: `${deaccent(fn)}.${deaccent(ln)}@demo.com`,
      role,
      status,
      department: dept,
      created: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
    });
  }
  return users;
}

export const store = {
  auth: {
    isLoggedIn: false,
    user: null,
  },
  credentials: { username: 'admin', password: 'playwright' },
  users: seededUsers(23),
  nextId: 24,
  theme: 'light',
  sidebarCollapsed: false,

  login(username, password) {
    if (username === this.credentials.username && password === this.credentials.password) {
      this.auth.isLoggedIn = true;
      this.auth.user = { name: 'Admin Demo', email: 'admin@demo.com', initials: 'AD', role: 'Administrador' };
      return true;
    }
    return false;
  },
  logout() {
    this.auth.isLoggedIn = false;
    this.auth.user = null;
  },
  addUser(data) {
    const u = { id: this.nextId++, created: new Date('2026-07-30').toISOString().slice(0, 10), ...data };
    this.users.unshift(u);
    return u;
  },
  updateUser(id, data) {
    const u = this.users.find(x => x.id === id);
    if (u) Object.assign(u, data);
    return u;
  },
  deleteUser(id) {
    this.users = this.users.filter(x => x.id !== id);
  },
  getUser(id) {
    return this.users.find(x => x.id === id);
  },
};

export const CATALOG = { roles, statuses, departments };
