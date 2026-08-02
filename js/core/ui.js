// ============================================================
// UI helpers — toasts, modales, utilidades DOM.
// ============================================================

// Escapa HTML para inserción segura.
export function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, m =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

const TOAST_META = {
  success: { icon: '✅', title: 'Éxito' },
  warning: { icon: '⚠️', title: 'Advertencia' },
  error:   { icon: '⛔', title: 'Error' },
  info:    { icon: 'ℹ️', title: 'Información' },
};

let toastSeq = 0;

// Muestra un toast. type: success|warning|error|info
export function toast(message, type = 'info', title) {
  const meta = TOAST_META[type] || TOAST_META.info;
  const container = document.getElementById('toast-container');
  const id = `toast-${++toastSeq}`;
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.id = id;
  el.setAttribute('data-testid', `toast-${type}`);
  el.setAttribute('role', 'alert');
  el.innerHTML = `
    <span class="toast__icon">${meta.icon}</span>
    <div class="toast__body">
      <div class="toast__title" data-testid="toast-title">${esc(title || meta.title)}</div>
      <div class="toast__msg" data-testid="toast-message">${esc(message)}</div>
    </div>
    <button class="toast__close" data-testid="toast-close" aria-label="Cerrar">✕</button>`;
  container.appendChild(el);
  const remove = () => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 200);
  };
  el.querySelector('.toast__close').addEventListener('click', remove);
  setTimeout(remove, 4200);
  return el;
}

// Abre un modal. opts: { title, body(html), footer(html), testid, onMount(modalEl) }
export function openModal({ title = '', body = '', footer = '', testid = 'modal', size, onMount } = {}) {
  const root = document.getElementById('modal-root');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('data-testid', `${testid}-overlay`);
  overlay.innerHTML = `
    <div class="modal" data-testid="${testid}" role="dialog" aria-modal="true"${size ? ` style="max-width:${size}px"` : ''}>
      <div class="modal__head">
        <h3 data-testid="${testid}-title">${esc(title)}</h3>
        <button class="modal__close" data-testid="${testid}-close" aria-label="Cerrar">✕</button>
      </div>
      <div class="modal__body" data-testid="${testid}-body">${body}</div>
      ${footer ? `<div class="modal__foot" data-testid="${testid}-footer">${footer}</div>` : ''}
    </div>`;
  root.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('.modal__close').addEventListener('click', close);
  overlay.addEventListener('mousedown', e => { if (e.target === overlay) close(); });
  const onKey = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);

  const modalEl = overlay.querySelector('.modal');
  if (onMount) onMount(modalEl, close);
  return { overlay, modalEl, close };
}

// Diálogo de confirmación estándar.
export function confirmDialog({ title = 'Confirmar', message = '', confirmText = 'Confirmar', danger = false, onConfirm } = {}) {
  const { close } = openModal({
    title,
    testid: 'confirm-modal',
    body: `<p data-testid="confirm-message">${esc(message)}</p>`,
    footer: `
      <button class="btn btn--outline" data-testid="confirm-cancel">Cancelar</button>
      <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-testid="confirm-accept">${esc(confirmText)}</button>`,
    onMount: (modal, closeFn) => {
      modal.querySelector('[data-testid="confirm-cancel"]').addEventListener('click', closeFn);
      modal.querySelector('[data-testid="confirm-accept"]').addEventListener('click', () => {
        closeFn();
        onConfirm && onConfirm();
      });
    },
  });
  return close;
}

// Cierra cualquier dropdown abierto salvo el indicado.
export function closeAllDropdowns(except) {
  document.querySelectorAll('.dropdown__menu.open').forEach(m => {
    if (m !== except) m.classList.remove('open');
  });
}
