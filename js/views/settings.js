// ============================================================
// Vista: Configuración
// ============================================================
import { store } from '../core/store.js';
import { toast } from '../core/ui.js';

export const settings = {
  render() {
    return `
    <div data-testid="settings-page">
      <div class="page-head">
        <div class="breadcrumb"><span>Inicio</span><span>Configuración</span></div>
        <h1 data-testid="page-title">Configuración</h1>
        <p>Preferencias de la aplicación (no persistentes).</p>
      </div>

      <div class="grid cols-2">
        <div class="card">
          <div class="card__head"><h3>Apariencia</h3></div>
          <div class="card__body">
            <div class="field">
              <label class="switch">
                <input type="checkbox" data-testid="setting-theme" ${store.theme === 'dark' ? 'checked' : ''} />
                <span class="switch__track"></span>
                <span>Modo oscuro</span>
              </label>
            </div>
            <div class="field">
              <label>Idioma</label>
              <select class="control" data-testid="setting-language">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
            <div class="field mb-0">
              <label>Densidad de la interfaz</label>
              <div class="chip-group">
                <label class="check mb-0"><input type="radio" name="density" value="compact" data-testid="density-compact"/><span>Compacta</span></label>
                <label class="check mb-0"><input type="radio" name="density" value="normal" data-testid="density-normal" checked/><span>Normal</span></label>
                <label class="check mb-0"><input type="radio" name="density" value="comfortable" data-testid="density-comfortable"/><span>Cómoda</span></label>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__head"><h3>Notificaciones</h3></div>
          <div class="card__body">
            ${[['Correo', 'notif-email', true], ['Push', 'notif-push', true], ['SMS', 'notif-sms', false], ['Resumen semanal', 'notif-weekly', true]]
              .map(([label, id, on]) => `
              <div class="field" style="margin-bottom:14px">
                <label class="switch mb-0">
                  <input type="checkbox" data-testid="${id}" ${on ? 'checked' : ''}/>
                  <span class="switch__track"></span>
                  <span>${label}</span>
                </label>
              </div>`).join('')}
          </div>
          <div class="card__foot">
            <button class="btn btn--outline" data-testid="settings-reset">Restablecer</button>
            <button class="btn btn--primary" data-testid="settings-save">Guardar cambios</button>
          </div>
        </div>
      </div>

      <div class="card mt-24" style="border-color:var(--danger)">
        <div class="card__head"><h3 style="color:var(--danger)">Zona de peligro</h3></div>
        <div class="card__body flex items-center gap-16 wrap">
          <div style="flex:1;min-width:220px"><strong>Eliminar cuenta</strong><p class="text-soft">Esta acción es permanente (simulada).</p></div>
          <button class="btn btn--danger" data-testid="delete-account">Eliminar cuenta</button>
        </div>
      </div>
    </div>`;
  },

  mount(root, { setTheme }) {
    root.querySelector('[data-testid="setting-theme"]').addEventListener('change', e => {
      setTheme(e.target.checked ? 'dark' : 'light');
    });
    root.querySelector('[data-testid="settings-save"]').addEventListener('click', () => toast('Configuración guardada.', 'success'));
    root.querySelector('[data-testid="settings-reset"]').addEventListener('click', () => toast('Valores restablecidos.', 'info'));
    root.querySelector('[data-testid="delete-account"]').addEventListener('click', () => {
      import('../core/ui.js').then(({ confirmDialog }) => confirmDialog({
        title: 'Eliminar cuenta',
        message: 'Se eliminará tu cuenta de forma permanente. ¿Continuar?',
        confirmText: 'Eliminar cuenta',
        danger: true,
        onConfirm: () => toast('Cuenta eliminada (simulado).', 'error', 'Cuenta eliminada'),
      }));
    });
  },
};
