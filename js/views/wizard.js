// ============================================================
// Vista: Asistente multi-paso (flujo por etapas)
// ============================================================
import { toast } from '../core/ui.js';

export const wizard = {
  render() {
    return `
    <div data-testid="wizard-page">
      <div class="page-head">
        <div class="breadcrumb"><span>Inicio</span><span>Flujos</span><span>Asistente</span></div>
        <h1 data-testid="page-title">Asistente de configuración</h1>
        <p>Un flujo de 3 pasos con navegación adelante/atrás y validación por etapa.</p>
      </div>

      <div class="card" style="max-width:640px">
        <div class="card__body">
          <div class="flex items-center gap-8" data-testid="stepper" style="margin-bottom:24px">
            ${['Cuenta', 'Perfil', 'Confirmar'].map((s, i) => `
              <div class="flex items-center gap-8" data-step-indicator="${i}">
                <span class="avatar sm ${i === 0 ? '' : ''}" data-testid="step-dot-${i}" style="${i === 0 ? '' : 'background:var(--border);color:var(--text-soft)'}">${i + 1}</span>
                <span class="${i === 0 ? '' : 'text-soft'}" data-testid="step-label-${i}">${s}</span>
              </div>
              ${i < 2 ? '<div style="flex:1;height:2px;background:var(--border)"></div>' : ''}`).join('')}
          </div>

          <form id="wizard-form" data-testid="wizard-form" novalidate>
            <div class="wizard-step" data-step="0" data-testid="wizard-step-0">
              <div class="field">
                <label>Nombre de usuario <span class="req">*</span></label>
                <input class="control" name="username" data-testid="wizard-username" placeholder="usuario123" />
                <div class="error-msg" data-testid="wizard-error-username">Requerido.</div>
              </div>
              <div class="field">
                <label>Correo <span class="req">*</span></label>
                <input class="control" name="email" type="email" data-testid="wizard-email" placeholder="correo@demo.com" />
                <div class="error-msg" data-testid="wizard-error-email">Correo inválido.</div>
              </div>
            </div>

            <div class="wizard-step hidden" data-step="1" data-testid="wizard-step-1">
              <div class="field">
                <label>Nombre para mostrar</label>
                <input class="control" name="display" data-testid="wizard-display" placeholder="Ana García" />
              </div>
              <div class="field">
                <label>Rol</label>
                <select class="control" name="role" data-testid="wizard-role">
                  <option>Administrador</option><option>Editor</option><option>Visualizador</option>
                </select>
              </div>
            </div>

            <div class="wizard-step hidden" data-step="2" data-testid="wizard-step-2">
              <div class="alert alert--info"><span>ℹ️</span><div class="alert__text">Revisa tus datos antes de finalizar.</div></div>
              <pre data-testid="wizard-summary" style="background:var(--bg-soft);padding:14px;border-radius:8px;font-size:13px"></pre>
            </div>

            <div class="flex gap-12 mt-24">
              <button type="button" class="btn btn--outline" data-testid="wizard-back" disabled>← Atrás</button>
              <div style="flex:1"></div>
              <button type="button" class="btn btn--primary" data-testid="wizard-next">Siguiente →</button>
              <button type="button" class="btn btn--success hidden" data-testid="wizard-finish">Finalizar ✓</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
  },

  mount(root) {
    const form = root.querySelector('#wizard-form');
    let step = 0;
    const steps = root.querySelectorAll('.wizard-step');
    const back = root.querySelector('[data-testid="wizard-back"]');
    const next = root.querySelector('[data-testid="wizard-next"]');
    const finish = root.querySelector('[data-testid="wizard-finish"]');

    const show = () => {
      steps.forEach(s => s.classList.toggle('hidden', Number(s.dataset.step) !== step));
      back.disabled = step === 0;
      next.classList.toggle('hidden', step === 2);
      finish.classList.toggle('hidden', step !== 2);
      for (let i = 0; i < 3; i++) {
        const dot = root.querySelector(`[data-testid="step-dot-${i}"]`);
        const label = root.querySelector(`[data-testid="step-label-${i}"]`);
        const done = i <= step;
        dot.style.background = done ? 'var(--primary)' : 'var(--border)';
        dot.style.color = done ? '#fff' : 'var(--text-soft)';
        label.classList.toggle('text-soft', !done);
      }
      if (step === 2) {
        root.querySelector('[data-testid="wizard-summary"]').textContent = JSON.stringify({
          usuario: form.elements['username'].value,
          correo: form.elements['email'].value,
          nombre: form.elements['display'].value || '(sin definir)',
          rol: form.elements['role'].value,
        }, null, 2);
      }
    };

    const validateStep = () => {
      if (step === 0) {
        const u = form.elements['username'].value.trim();
        const e = form.elements['email'].value.trim();
        const uOk = u.length > 0;
        const eOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
        root.querySelector('[data-testid="wizard-step-0"]').querySelectorAll('.field')[0].classList.toggle('invalid', !uOk);
        root.querySelector('[data-testid="wizard-step-0"]').querySelectorAll('.field')[1].classList.toggle('invalid', !eOk);
        return uOk && eOk;
      }
      return true;
    };

    next.addEventListener('click', () => {
      if (!validateStep()) { toast('Completa los campos requeridos.', 'warning'); return; }
      step = Math.min(2, step + 1); show();
    });
    back.addEventListener('click', () => { step = Math.max(0, step - 1); show(); });
    finish.addEventListener('click', () => { toast('¡Configuración completada!', 'success', 'Asistente finalizado'); step = 0; form.reset(); show(); });

    show();
  },
};
