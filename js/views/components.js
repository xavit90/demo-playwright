// ============================================================
// Vista: Componentes UI (botones, notificaciones, modales…)
// ============================================================
import { toast, openModal, confirmDialog } from '../core/ui.js';

export const components = {
  render() {
    return `
    <div data-testid="components-page">
      <div class="page-head">
        <div class="breadcrumb"><span>Inicio</span><span>Componentes</span></div>
        <h1 data-testid="page-title">Componentes e interacciones</h1>
        <p>Botones, notificaciones, modales, pestañas, acordeones y más.</p>
      </div>

      <!-- Botones -->
      <div class="card">
        <div class="card__head"><h3>Botones</h3></div>
        <div class="card__body">
          <div class="chip-group" style="margin-bottom:16px">
            <button class="btn btn--primary" data-testid="btn-primary">Primario</button>
            <button class="btn btn--success" data-testid="btn-success">Éxito</button>
            <button class="btn btn--warning" data-testid="btn-warning">Advertencia</button>
            <button class="btn btn--danger" data-testid="btn-danger">Peligro</button>
            <button class="btn btn--info" data-testid="btn-info">Info</button>
            <button class="btn btn--outline" data-testid="btn-outline">Contorno</button>
            <button class="btn btn--ghost" data-testid="btn-ghost">Fantasma</button>
          </div>
          <div class="chip-group">
            <button class="btn btn--primary btn--sm" data-testid="btn-sm">Pequeño</button>
            <button class="btn btn--primary" data-testid="btn-md">Mediano</button>
            <button class="btn btn--primary btn--lg" data-testid="btn-lg">Grande</button>
            <button class="btn btn--primary" disabled data-testid="btn-disabled">Deshabilitado</button>
            <button class="btn btn--primary" data-testid="btn-loading">Cargar (spinner)</button>
            <button class="btn btn--outline" data-testid="btn-counter">Clics: <b data-testid="counter-value" style="margin-left:4px">0</b></button>
            <button class="btn btn--info" data-testid="btn-double">Doble clic</button>
          </div>
          <p class="hint" data-testid="double-status" style="margin-top:10px">Prueba el doble clic en el botón "Doble clic".</p>
        </div>
      </div>

      <!-- Notificaciones -->
      <div class="card mt-24">
        <div class="card__head"><h3>Notificaciones (toasts)</h3></div>
        <div class="card__body">
          <div class="chip-group">
            <button class="btn btn--success" data-testid="toast-success-btn">Éxito</button>
            <button class="btn btn--warning" data-testid="toast-warning-btn">Advertencia</button>
            <button class="btn btn--danger" data-testid="toast-error-btn">Error</button>
            <button class="btn btn--info" data-testid="toast-info-btn">Información</button>
          </div>
        </div>
      </div>

      <!-- Alertas -->
      <div class="card mt-24">
        <div class="card__head"><h3>Alertas en línea</h3></div>
        <div class="card__body">
          <div class="alert alert--success" data-testid="alert-success"><span>✅</span><div class="alert__text"><strong>Operación exitosa</strong>Tus cambios se guardaron correctamente.</div></div>
          <div class="alert alert--warning" data-testid="alert-warning"><span>⚠️</span><div class="alert__text"><strong>Atención</strong>Tu sesión expirará pronto.</div></div>
          <div class="alert alert--danger" data-testid="alert-danger"><span>⛔</span><div class="alert__text"><strong>Error</strong>No se pudo conectar con el servidor.</div></div>
          <div class="alert alert--info mb-0" data-testid="alert-info"><span>ℹ️</span><div class="alert__text"><strong>Información</strong>Hay una nueva versión disponible.</div></div>
        </div>
      </div>

      <!-- Modales -->
      <div class="card mt-24">
        <div class="card__head"><h3>Modales y diálogos</h3></div>
        <div class="card__body">
          <div class="chip-group">
            <button class="btn btn--primary" data-testid="open-modal-btn">Abrir modal</button>
            <button class="btn btn--danger" data-testid="open-confirm-btn">Diálogo de confirmación</button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="card mt-24">
        <div class="card__head"><h3>Pestañas (tabs)</h3></div>
        <div class="card__body">
          <div class="tabs" data-testid="tabs">
            <button class="tab active" data-tab="0" data-testid="tab-0">General</button>
            <button class="tab" data-tab="1" data-testid="tab-1">Seguridad</button>
            <button class="tab" data-tab="2" data-testid="tab-2">Facturación</button>
          </div>
          <div class="tab-panel active" data-testid="panel-0"><p>Configuración general de la cuenta y preferencias.</p></div>
          <div class="tab-panel" data-testid="panel-1"><p>Contraseña, autenticación de dos factores y sesiones activas.</p></div>
          <div class="tab-panel" data-testid="panel-2"><p>Método de pago, historial de facturas y suscripción.</p></div>
        </div>
      </div>

      <!-- Acordeón -->
      <div class="card mt-24">
        <div class="card__head"><h3>Acordeón</h3></div>
        <div class="card__body" data-testid="accordion">
          ${[['¿Qué es Playwright?', 'Un framework de automatización para pruebas end-to-end en navegadores modernos.'],
             ['¿Necesito un backend?', 'No. Esta demo funciona 100% en el cliente, sin persistencia real.'],
             ['¿Cómo selecciono elementos?', 'Usa los atributos data-testid presentes en toda la aplicación.']]
            .map(([q, a], i) => `
            <div class="accordion__item ${i === 0 ? 'open' : ''}" data-testid="accordion-item-${i}">
              <button class="accordion__head" data-acc="${i}" data-testid="accordion-head-${i}">${q}<span class="caret">▾</span></button>
              <div class="accordion__body"><div class="accordion__body-inner">${a}</div></div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Progreso / spinner -->
      <div class="card mt-24">
        <div class="card__head"><h3>Progreso y carga</h3></div>
        <div class="card__body">
          <div class="flex items-center gap-16" style="margin-bottom:18px">
            <div class="spinner" data-testid="spinner"></div>
            <span class="text-soft">Cargando datos…</span>
          </div>
          <div class="progress" data-testid="progress"><div class="progress__bar" data-testid="progress-bar" style="width:35%"></div></div>
          <div class="flex gap-12 mt-16">
            <button class="btn btn--outline btn--sm" data-testid="progress-dec">− 10%</button>
            <button class="btn btn--outline btn--sm" data-testid="progress-inc">+ 10%</button>
            <span class="badge badge--neutral" data-testid="progress-label">35%</span>
          </div>
        </div>
      </div>

      <!-- Tooltip -->
      <div class="card mt-24">
        <div class="card__head"><h3>Tooltip</h3></div>
        <div class="card__body">
          <div class="tooltip" data-testid="tooltip">
            <button class="btn btn--outline">Pasa el cursor aquí</button>
            <span class="tooltip__bubble" data-testid="tooltip-text">¡Soy un tooltip! 🎉</span>
          </div>
        </div>
      </div>
    </div>`;
  },

  mount(root) {
    // Botones simples con feedback.
    const map = {
      'btn-primary': 'Botón primario pulsado.',
      'btn-success': 'Acción exitosa registrada.',
      'btn-warning': 'Se emitió una advertencia.',
      'btn-danger': 'Acción peligrosa detectada.',
      'btn-info': 'Aquí tienes información.',
      'btn-outline': 'Botón de contorno.',
      'btn-ghost': 'Botón fantasma.',
    };
    const typeByKey = { 'btn-success': 'success', 'btn-warning': 'warning', 'btn-danger': 'error', 'btn-info': 'info' };
    Object.entries(map).forEach(([key, msg]) => {
      const el = root.querySelector(`[data-testid="${key}"]`);
      el && el.addEventListener('click', () => toast(msg, typeByKey[key] || 'info'));
    });

    // Loading button.
    const loadBtn = root.querySelector('[data-testid="btn-loading"]');
    loadBtn.addEventListener('click', () => {
      loadBtn.disabled = true;
      const original = loadBtn.textContent;
      loadBtn.innerHTML = '<span class="btn__spinner"></span> Cargando…';
      setTimeout(() => { loadBtn.disabled = false; loadBtn.textContent = original; toast('Carga completada.', 'success'); }, 1500);
    });

    // Counter.
    let count = 0;
    const counterVal = root.querySelector('[data-testid="counter-value"]');
    root.querySelector('[data-testid="btn-counter"]').addEventListener('click', () => { counterVal.textContent = ++count; });

    // Double click.
    root.querySelector('[data-testid="btn-double"]').addEventListener('dblclick', () => {
      root.querySelector('[data-testid="double-status"]').textContent = '¡Doble clic detectado! ✅';
      toast('Evento de doble clic capturado.', 'success');
    });

    // Toasts.
    root.querySelector('[data-testid="toast-success-btn"]').addEventListener('click', () => toast('Todo salió bien.', 'success'));
    root.querySelector('[data-testid="toast-warning-btn"]').addEventListener('click', () => toast('Ten cuidado con esto.', 'warning'));
    root.querySelector('[data-testid="toast-error-btn"]').addEventListener('click', () => toast('Algo salió mal.', 'error'));
    root.querySelector('[data-testid="toast-info-btn"]').addEventListener('click', () => toast('Dato interesante.', 'info'));

    // Modal.
    root.querySelector('[data-testid="open-modal-btn"]').addEventListener('click', () => {
      openModal({
        title: 'Modal de ejemplo',
        testid: 'demo-modal',
        body: '<p>Este es un modal accesible. Ciérralo con la ✕, con Escape o haciendo clic fuera.</p><input class="control mt-16" placeholder="Escribe algo…" data-testid="demo-modal-input" />',
        footer: '<button class="btn btn--outline" data-testid="demo-modal-cancel">Cancelar</button><button class="btn btn--primary" data-testid="demo-modal-ok">Aceptar</button>',
        onMount: (modal, close) => {
          modal.querySelector('[data-testid="demo-modal-cancel"]').addEventListener('click', close);
          modal.querySelector('[data-testid="demo-modal-ok"]').addEventListener('click', () => { close(); toast('Modal aceptado.', 'success'); });
        },
      });
    });

    // Confirm.
    root.querySelector('[data-testid="open-confirm-btn"]').addEventListener('click', () => {
      confirmDialog({
        title: 'Eliminar elemento',
        message: '¿Estás seguro? Esta acción es irreversible.',
        confirmText: 'Sí, eliminar',
        danger: true,
        onConfirm: () => toast('Elemento eliminado.', 'success', 'Hecho'),
      });
    });

    // Tabs.
    root.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = tab.dataset.tab;
        root.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        root.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        root.querySelector(`[data-testid="panel-${idx}"]`).classList.add('active');
      });
    });

    // Accordion.
    root.querySelectorAll('[data-acc]').forEach(head => {
      head.addEventListener('click', () => head.closest('.accordion__item').classList.toggle('open'));
    });

    // Progress.
    let pct = 35;
    const bar = root.querySelector('[data-testid="progress-bar"]');
    const label = root.querySelector('[data-testid="progress-label"]');
    const setPct = v => { pct = Math.max(0, Math.min(100, v)); bar.style.width = pct + '%'; label.textContent = pct + '%'; };
    root.querySelector('[data-testid="progress-inc"]').addEventListener('click', () => setPct(pct + 10));
    root.querySelector('[data-testid="progress-dec"]').addEventListener('click', () => setPct(pct - 10));
  },
};
