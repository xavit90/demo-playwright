// ============================================================
// Vista: Usuarios (CRUD en memoria)
// ============================================================
import { store, CATALOG } from '../core/store.js';
import { toast, esc, openModal, confirmDialog } from '../core/ui.js';
import { statusBadge } from './dashboard.js';

const PAGE_SIZE = 6;

export const users = {
  render() {
    return `
    <div data-testid="users-page">
      <div class="page-head">
        <div class="breadcrumb"><span>Inicio</span><span>Gestión</span><span>Usuarios</span></div>
        <div class="flex items-center">
          <div>
            <h1 data-testid="page-title">Usuarios</h1>
            <p>Crea, edita y elimina usuarios. Datos en memoria (sin persistencia).</p>
          </div>
          <button class="btn btn--primary" data-testid="btn-new-user" style="margin-left:auto">➕ Nuevo usuario</button>
        </div>
      </div>

      <div class="card">
        <div class="card__body">
          <div class="table-toolbar">
            <div class="topbar__search" style="max-width:280px">
              <input class="control" type="search" placeholder="Buscar por nombre o correo…" data-testid="users-search" />
            </div>
            <select class="control" style="width:auto" data-testid="filter-role">
              <option value="">Todos los roles</option>
              ${CATALOG.roles.map(r => `<option value="${r}">${r}</option>`).join('')}
            </select>
            <select class="control" style="width:auto" data-testid="filter-status">
              <option value="">Todos los estados</option>
              ${CATALOG.statuses.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
            <div class="spacer"></div>
            <span class="badge badge--neutral" data-testid="users-count"></span>
          </div>

          <div class="table-wrap">
            <table class="table" data-testid="users-table">
              <thead>
                <tr>
                  <th><input type="checkbox" data-testid="select-all" /></th>
                  <th>Usuario</th><th>Rol</th><th>Departamento</th><th>Estado</th><th>Alta</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody data-testid="users-tbody"></tbody>
            </table>
          </div>

          <div id="users-empty" class="empty-state hidden" data-testid="users-empty">
            <span class="emoji">🔍</span>
            <p>No se encontraron usuarios con esos criterios.</p>
          </div>

          <div class="pagination" data-testid="users-pagination"></div>
        </div>
      </div>
    </div>`;
  },

  mount(root) {
    const state = { search: '', role: '', status: '', page: 1 };
    const tbody = root.querySelector('[data-testid="users-tbody"]');
    const empty = root.querySelector('[data-testid="users-empty"]');
    const pager = root.querySelector('[data-testid="users-pagination"]');
    const countEl = root.querySelector('[data-testid="users-count"]');

    const filtered = () => store.users.filter(u => {
      const q = state.search.toLowerCase();
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchR = !state.role || u.role === state.role;
      const matchS = !state.status || u.status === state.status;
      return matchQ && matchR && matchS;
    });

    const renderTable = () => {
      const list = filtered();
      const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      if (state.page > pages) state.page = pages;
      const slice = list.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

      countEl.textContent = `${list.length} usuario${list.length === 1 ? '' : 's'}`;
      empty.classList.toggle('hidden', list.length !== 0);

      tbody.innerHTML = slice.map(u => `
        <tr data-testid="user-row-${u.id}" data-id="${u.id}">
          <td><input type="checkbox" class="row-check" /></td>
          <td>
            <div class="cell-user">
              <span class="avatar sm">${esc(u.name.split(' ').map(n => n[0]).join(''))}</span>
              <div>
                <div style="font-weight:600" data-testid="user-name">${esc(u.name)}</div>
                <div class="text-soft" style="font-size:12px" data-testid="user-email">${esc(u.email)}</div>
              </div>
            </div>
          </td>
          <td>${esc(u.role)}</td>
          <td>${esc(u.department)}</td>
          <td>${statusBadge(u.status)}</td>
          <td class="text-soft">${esc(u.created)}</td>
          <td>
            <div class="actions">
              <button class="btn btn--outline btn--sm" data-action="edit" data-testid="btn-edit-${u.id}" title="Editar">✏️</button>
              <button class="btn btn--outline btn--sm" data-action="delete" data-testid="btn-delete-${u.id}" title="Eliminar">🗑️</button>
            </div>
          </td>
        </tr>`).join('');

      // Paginación.
      let btns = `<span class="text-soft" style="margin-right:auto">Página ${state.page} de ${pages}</span>`;
      btns += `<button data-page="prev" data-testid="page-prev" ${state.page === 1 ? 'disabled' : ''}>‹</button>`;
      for (let p = 1; p <= pages; p++) {
        btns += `<button data-page="${p}" data-testid="page-${p}" class="${p === state.page ? 'active' : ''}">${p}</button>`;
      }
      btns += `<button data-page="next" data-testid="page-next" ${state.page === pages ? 'disabled' : ''}>›</button>`;
      pager.innerHTML = btns;
    };

    // Búsqueda y filtros.
    root.querySelector('[data-testid="users-search"]').addEventListener('input', e => { state.search = e.target.value; state.page = 1; renderTable(); });
    root.querySelector('[data-testid="filter-role"]').addEventListener('change', e => { state.role = e.target.value; state.page = 1; renderTable(); });
    root.querySelector('[data-testid="filter-status"]').addEventListener('change', e => { state.status = e.target.value; state.page = 1; renderTable(); });

    pager.addEventListener('click', e => {
      const btn = e.target.closest('button[data-page]');
      if (!btn) return;
      const p = btn.getAttribute('data-page');
      const pages = Math.max(1, Math.ceil(filtered().length / PAGE_SIZE));
      if (p === 'prev') state.page = Math.max(1, state.page - 1);
      else if (p === 'next') state.page = Math.min(pages, state.page + 1);
      else state.page = Number(p);
      renderTable();
    });

    // Select all.
    root.querySelector('[data-testid="select-all"]').addEventListener('change', e => {
      tbody.querySelectorAll('.row-check').forEach(c => c.checked = e.target.checked);
    });

    // Acciones fila.
    tbody.addEventListener('click', e => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = Number(btn.closest('tr').dataset.id);
      if (btn.dataset.action === 'edit') openUserModal(id, renderTable);
      else deleteUser(id, renderTable);
    });

    root.querySelector('[data-testid="btn-new-user"]').addEventListener('click', () => openUserModal(null, renderTable));

    renderTable();
  },
};

function deleteUser(id, refresh) {
  const u = store.getUser(id);
  confirmDialog({
    title: 'Eliminar usuario',
    message: `¿Seguro que deseas eliminar a "${u.name}"? Esta acción no se puede deshacer.`,
    confirmText: 'Sí, eliminar',
    danger: true,
    onConfirm: () => {
      store.deleteUser(id);
      toast(`Usuario "${u.name}" eliminado.`, 'success', 'Eliminado');
      refresh();
    },
  });
}

function openUserModal(id, refresh) {
  const editing = id != null;
  const u = editing ? store.getUser(id) : { name: '', email: '', role: CATALOG.roles[0], status: 'Activo', department: CATALOG.departments[0] };

  const body = `
    <form id="user-form" data-testid="user-form" novalidate>
      <div class="field" data-testid="uf-name">
        <label>Nombre completo <span class="req">*</span></label>
        <input class="control" name="name" data-testid="user-name-input" value="${esc(u.name)}" placeholder="Ej. Ana García" />
        <div class="error-msg" data-testid="uf-error-name">Ingresa un nombre válido.</div>
      </div>
      <div class="field" data-testid="uf-email">
        <label>Correo <span class="req">*</span></label>
        <input class="control" name="email" type="email" data-testid="user-email-input" value="${esc(u.email)}" placeholder="correo@demo.com" />
        <div class="error-msg" data-testid="uf-error-email">Ingresa un correo válido.</div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Rol</label>
          <select class="control" name="role" data-testid="user-role-input">
            ${CATALOG.roles.map(r => `<option ${r === u.role ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>Departamento</label>
          <select class="control" name="department" data-testid="user-dept-input">
            ${CATALOG.departments.map(d => `<option ${d === u.department ? 'selected' : ''}>${d}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field">
        <label>Estado</label>
        <select class="control" name="status" data-testid="user-status-input">
          ${CATALOG.statuses.map(s => `<option ${s === u.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
    </form>`;

  openModal({
    title: editing ? 'Editar usuario' : 'Nuevo usuario',
    testid: 'user-modal',
    body,
    footer: `
      <button class="btn btn--outline" data-testid="user-cancel">Cancelar</button>
      <button class="btn btn--primary" data-testid="user-save">${editing ? 'Guardar cambios' : 'Crear usuario'}</button>`,
    onMount: (modal, close) => {
      modal.querySelector('[data-testid="user-cancel"]').addEventListener('click', close);
      modal.querySelector('[data-testid="user-save"]').addEventListener('click', () => {
        const form = modal.querySelector('#user-form');
        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const nameOk = name.length >= 3;
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        modal.querySelector('[data-testid="uf-name"]').classList.toggle('invalid', !nameOk);
        modal.querySelector('[data-testid="uf-email"]').classList.toggle('invalid', !emailOk);
        if (!nameOk || !emailOk) { toast('Corrige los datos del formulario.', 'warning', 'Datos incompletos'); return; }

        const data = {
          name, email,
          role: form.elements['role'].value,
          department: form.elements['department'].value,
          status: form.elements['status'].value,
        };
        if (editing) { store.updateUser(id, data); toast(`Usuario "${name}" actualizado.`, 'success', 'Guardado'); }
        else { store.addUser(data); toast(`Usuario "${name}" creado.`, 'success', 'Creado'); }
        close();
        refresh();
      });
    },
  });
}
