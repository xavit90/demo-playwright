// ============================================================
// Vista: Formularios — tipos de campo + validaciones
// ============================================================
import { CATALOG } from '../core/store.js';
import { toast, esc } from '../core/ui.js';

export const forms = {
  render() {
    return `
    <div data-testid="forms-page">
      <div class="page-head">
        <div class="breadcrumb"><span>Inicio</span><span>Formularios</span></div>
        <h1 data-testid="page-title">Formularios y validaciones</h1>
        <p>Una gran variedad de campos con validación en tiempo real y al enviar.</p>
      </div>

      <div class="grid" style="grid-template-columns: 2fr 1fr">
        <div class="card">
          <div class="card__head"><h3>Formulario de registro</h3><span class="card__sub" style="margin-left:auto">Todos los campos marcados con * son obligatorios</span></div>
          <div class="card__body">
            <form id="demo-form" data-testid="demo-form" novalidate>
              <div class="form-row">
                <div class="field" data-testid="field-fullname">
                  <label for="f-fullname">Nombre completo <span class="req">*</span></label>
                  <input class="control" id="f-fullname" name="fullname" type="text" data-testid="input-fullname" placeholder="Ej. Ana García" />
                  <div class="error-msg" data-testid="error-fullname">Ingresa tu nombre (mínimo 3 caracteres).</div>
                </div>
                <div class="field" data-testid="field-email">
                  <label for="f-email">Correo electrónico <span class="req">*</span></label>
                  <input class="control" id="f-email" name="email" type="email" data-testid="input-email" placeholder="tucorreo@ejemplo.com" />
                  <div class="error-msg" data-testid="error-email">Ingresa un correo válido.</div>
                </div>
              </div>

              <div class="form-row">
                <div class="field" data-testid="field-phone">
                  <label for="f-phone">Teléfono</label>
                  <div class="input-group">
                    <span class="addon">+52</span>
                    <input class="control" id="f-phone" name="phone" type="tel" data-testid="input-phone" placeholder="10 dígitos" />
                  </div>
                  <div class="error-msg" data-testid="error-phone">El teléfono debe tener 10 dígitos.</div>
                </div>
                <div class="field" data-testid="field-age">
                  <label for="f-age">Edad</label>
                  <input class="control" id="f-age" name="age" type="number" min="18" max="120" data-testid="input-age" placeholder="18+" />
                  <div class="error-msg" data-testid="error-age">Debes ser mayor de 18 años.</div>
                </div>
              </div>

              <div class="field" data-testid="field-password">
                <label for="f-password">Contraseña <span class="req">*</span></label>
                <input class="control" id="f-password" name="password" type="password" data-testid="input-password" placeholder="Mínimo 8 caracteres" />
                <div class="progress mt-8" style="height:6px"><div class="progress__bar" data-testid="password-strength" style="width:0%;background:var(--danger)"></div></div>
                <div class="hint" data-testid="password-hint">Usa mayúsculas, números y símbolos para mayor seguridad.</div>
                <div class="error-msg" data-testid="error-password">La contraseña debe tener al menos 8 caracteres.</div>
              </div>

              <div class="form-row">
                <div class="field" data-testid="field-birthdate">
                  <label for="f-birth">Fecha de nacimiento</label>
                  <input class="control" id="f-birth" name="birthdate" type="date" data-testid="input-birthdate" />
                </div>
                <div class="field" data-testid="field-country">
                  <label for="f-country">País</label>
                  <select class="control" id="f-country" name="country" data-testid="select-country">
                    <option value="">Selecciona…</option>
                    <option value="mx">México</option>
                    <option value="es">España</option>
                    <option value="ar">Argentina</option>
                    <option value="co">Colombia</option>
                    <option value="cl">Chile</option>
                  </select>
                </div>
              </div>

              <div class="field" data-testid="field-skills">
                <label for="f-skills">Habilidades (multiselección)</label>
                <select class="control" id="f-skills" name="skills" data-testid="select-skills" multiple size="4">
                  <option value="pw">Playwright</option>
                  <option value="cy">Cypress</option>
                  <option value="se">Selenium</option>
                  <option value="js">JavaScript</option>
                  <option value="ts">TypeScript</option>
                </select>
                <div class="hint">Mantén Ctrl/Cmd para seleccionar varias.</div>
              </div>

              <div class="field" data-testid="field-plan">
                <label>Plan <span class="req">*</span></label>
                <div class="chip-group" style="flex-direction:column;gap:0">
                  ${['Gratis', 'Pro', 'Empresa'].map((p, i) => `
                    <label class="check">
                      <input type="radio" name="plan" value="${p.toLowerCase()}" data-testid="radio-plan-${p.toLowerCase()}" ${i === 0 ? '' : ''}/>
                      <span>${p}</span>
                    </label>`).join('')}
                </div>
                <div class="error-msg" data-testid="error-plan">Selecciona un plan.</div>
              </div>

              <div class="form-row">
                <div class="field" data-testid="field-experience">
                  <label for="f-exp">Años de experiencia: <b data-testid="range-value">3</b></label>
                  <input class="control" id="f-exp" name="experience" type="range" min="0" max="20" value="3" data-testid="input-range" />
                </div>
                <div class="field" data-testid="field-color">
                  <label for="f-color">Color favorito</label>
                  <input class="control" id="f-color" name="color" type="color" value="#2563eb" data-testid="input-color" />
                </div>
              </div>

              <div class="field" data-testid="field-avatar">
                <label for="f-avatar">Avatar (archivo)</label>
                <input class="control" id="f-avatar" name="avatar" type="file" accept="image/*" data-testid="input-file" />
                <div class="hint" data-testid="file-name">Ningún archivo seleccionado.</div>
              </div>

              <div class="field" data-testid="field-bio">
                <label for="f-bio">Biografía</label>
                <textarea class="control" id="f-bio" name="bio" data-testid="input-bio" placeholder="Cuéntanos sobre ti…" maxlength="200"></textarea>
                <div class="hint"><span data-testid="bio-count">0</span>/200 caracteres</div>
              </div>

              <div class="divider"></div>

              <div class="field">
                <label class="switch">
                  <input type="checkbox" name="notifications" data-testid="switch-notifications" checked />
                  <span class="switch__track"></span>
                  <span>Recibir notificaciones por correo</span>
                </label>
              </div>

              <div class="field" data-testid="field-terms">
                <label class="check">
                  <input type="checkbox" name="terms" data-testid="checkbox-terms" />
                  <span>Acepto los <a href="#" class="btn--ghost" style="padding:0" data-testid="terms-link">términos y condiciones</a> <span class="req">*</span></span>
                </label>
                <div class="error-msg" data-testid="error-terms">Debes aceptar los términos.</div>
              </div>

              <div class="flex gap-12 mt-16">
                <button type="submit" class="btn btn--primary" data-testid="form-submit">Enviar formulario</button>
                <button type="reset" class="btn btn--outline" data-testid="form-reset">Limpiar</button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div class="card">
            <div class="card__head"><h3>Resumen</h3></div>
            <div class="card__body">
              <p class="text-soft">Al enviar correctamente verás aquí los datos capturados.</p>
              <pre id="form-output" data-testid="form-output" style="display:none;background:var(--bg-soft);padding:14px;border-radius:8px;overflow:auto;font-size:12px;margin-top:12px"></pre>
              <div id="form-success" data-testid="form-success" class="alert alert--success mt-16 hidden">
                <span>✅</span><div class="alert__text"><strong>¡Formulario enviado!</strong>Todos los datos son válidos.</div>
              </div>
            </div>
          </div>

          <div class="card mt-24">
            <div class="card__head"><h3>Estados de validación</h3></div>
            <div class="card__body">
              <div class="alert alert--info"><span>ℹ️</span><div class="alert__text">Los campos se validan al perder el foco y al enviar.</div></div>
              <div class="chip-group">
                <span class="badge badge--success">✓ Válido</span>
                <span class="badge badge--danger">✕ Inválido</span>
                <span class="badge badge--warning">! Requerido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  mount(root) {
    const form = root.querySelector('#demo-form');

    const setState = (name, state) => {
      const f = root.querySelector(`[data-testid="field-${name}"]`);
      if (f) { f.classList.remove('valid', 'invalid'); if (state) f.classList.add(state); }
    };

    const validators = {
      fullname: v => v.trim().length >= 3,
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      phone: v => v === '' || /^\d{10}$/.test(v.trim()),
      age: v => v === '' || Number(v) >= 18,
      password: v => v.length >= 8,
      plan: () => !!form.querySelector('input[name="plan"]:checked'),
      terms: () => form.querySelector('[data-testid="checkbox-terms"]').checked,
    };

    const validateField = name => {
      const el = form.elements[name];
      const value = el && el.value !== undefined ? el.value : '';
      const ok = validators[name](value);
      setState(name, ok ? 'valid' : 'invalid');
      return ok;
    };

    // Validación en vivo (blur).
    ['fullname', 'email', 'phone', 'age', 'password'].forEach(name => {
      const el = form.elements[name];
      el.addEventListener('blur', () => { if (el.value) validateField(name); });
    });

    // Fuerza de contraseña.
    const passEl = form.elements['password'];
    passEl.addEventListener('input', () => {
      const v = passEl.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      const bar = root.querySelector('[data-testid="password-strength"]');
      const pct = [0, 25, 50, 75, 100][score];
      const color = ['var(--danger)', 'var(--danger)', 'var(--warning)', 'var(--info)', 'var(--success)'][score];
      bar.style.width = pct + '%';
      bar.style.background = color;
    });

    // Range value.
    const range = root.querySelector('[data-testid="input-range"]');
    range.addEventListener('input', () => { root.querySelector('[data-testid="range-value"]').textContent = range.value; });

    // File name.
    const file = root.querySelector('[data-testid="input-file"]');
    file.addEventListener('change', () => {
      root.querySelector('[data-testid="file-name"]').textContent =
        file.files.length ? file.files[0].name : 'Ningún archivo seleccionado.';
    });

    // Bio counter.
    const bio = root.querySelector('[data-testid="input-bio"]');
    bio.addEventListener('input', () => { root.querySelector('[data-testid="bio-count"]').textContent = bio.value.length; });

    root.querySelector('[data-testid="terms-link"]').addEventListener('click', e => {
      e.preventDefault();
      toast('Documento no disponible en la demo.', 'info', 'Términos y condiciones');
    });

    form.addEventListener('reset', () => {
      root.querySelectorAll('.field').forEach(f => f.classList.remove('valid', 'invalid'));
      root.querySelector('[data-testid="form-output"]').style.display = 'none';
      root.querySelector('[data-testid="form-success"]').classList.add('hidden');
      root.querySelector('[data-testid="password-strength"]').style.width = '0%';
      root.querySelector('[data-testid="range-value"]').textContent = '3';
      root.querySelector('[data-testid="bio-count"]').textContent = '0';
      root.querySelector('[data-testid="file-name"]').textContent = 'Ningún archivo seleccionado.';
      toast('Formulario reiniciado.', 'info');
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const required = ['fullname', 'email', 'password', 'plan', 'terms'];
      const optional = ['phone', 'age'];
      let allOk = true;
      [...required, ...optional].forEach(name => { if (!validateField(name)) allOk = false; });

      if (!allOk) {
        toast('Revisa los campos marcados en rojo.', 'error', 'Validación fallida');
        const firstInvalid = root.querySelector('.field.invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const data = {
        nombre: form.elements['fullname'].value,
        correo: form.elements['email'].value,
        telefono: form.elements['phone'].value || null,
        edad: form.elements['age'].value || null,
        pais: form.elements['country'].value || null,
        habilidades: Array.from(form.elements['skills'].selectedOptions).map(o => o.value),
        plan: (form.querySelector('input[name="plan"]:checked') || {}).value,
        experiencia: form.elements['experience'].value,
        color: form.elements['color'].value,
        notificaciones: form.elements['notifications'].checked,
      };
      const out = root.querySelector('[data-testid="form-output"]');
      out.textContent = JSON.stringify(data, null, 2);
      out.style.display = 'block';
      root.querySelector('[data-testid="form-success"]').classList.remove('hidden');
      toast('Formulario enviado correctamente.', 'success', '¡Listo!');
    });
  },
};
