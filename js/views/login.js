// ============================================================
// Vista: Login (simulado)
// ============================================================
import { store } from '../core/store.js';
import { toast } from '../core/ui.js';

export const login = {
  fullscreen: true,
  render() {
    return `
    <div class="auth" data-testid="login-page">
      <div class="auth__hero">
        <span class="hero-badge">🎭 Playwright Demo</span>
        <h1>Automatiza todo,<br>rompe nada.</h1>
        <p>Entorno de práctica con formularios, tablas, modales, notificaciones y flujos CRUD listos para tus pruebas end-to-end.</p>
        <ul>
          <li>✔️ Selectores estables con <code>data-testid</code></li>
          <li>✔️ Validaciones y estados de error</li>
          <li>✔️ Flujos de login, dashboard y CRUD</li>
        </ul>
      </div>
      <div class="auth__panel">
        <div class="auth__box">
          <h2>Iniciar sesión</h2>
          <p class="sub">Bienvenido de nuevo. Ingresa tus credenciales.</p>

          <div class="auth__demo" data-testid="login-hint">
            Credenciales demo — usuario: <code>admin</code> · contraseña: <code>playwright</code>
          </div>

          <form id="login-form" data-testid="login-form" novalidate>
            <div class="field" data-testid="field-username">
              <label for="username">Usuario <span class="req">*</span></label>
              <input class="control" id="username" name="username" type="text"
                     data-testid="login-username" placeholder="Tu usuario" autocomplete="username" />
              <div class="error-msg" data-testid="error-username">El usuario es obligatorio.</div>
            </div>

            <div class="field" data-testid="field-password">
              <label for="password">Contraseña <span class="req">*</span></label>
              <div class="input-group">
                <input class="control" id="password" name="password" type="password"
                       data-testid="login-password" placeholder="••••••••" autocomplete="current-password" />
                <button type="button" class="addon" data-testid="toggle-password" aria-label="Mostrar contraseña">👁️</button>
              </div>
              <div class="error-msg" data-testid="error-password">La contraseña es obligatoria.</div>
            </div>

            <div class="flex items-center" style="justify-content:space-between;margin-bottom:18px">
              <label class="check mb-0">
                <input type="checkbox" data-testid="login-remember" />
                <span>Recuérdame</span>
              </label>
              <a href="#" class="btn--ghost" style="padding:0" data-testid="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" class="btn btn--primary btn--block btn--lg" data-testid="login-submit">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>`;
  },

  mount(root, { navigate }) {
    const form = root.querySelector('#login-form');
    const userEl = root.querySelector('[data-testid="login-username"]');
    const passEl = root.querySelector('[data-testid="login-password"]');
    const submitBtn = root.querySelector('[data-testid="login-submit"]');

    root.querySelector('[data-testid="toggle-password"]').addEventListener('click', () => {
      passEl.type = passEl.type === 'password' ? 'text' : 'password';
    });
    root.querySelector('[data-testid="forgot-password"]').addEventListener('click', e => {
      e.preventDefault();
      toast('Función no disponible en la demo.', 'info', 'Recuperar contraseña');
    });

    const setInvalid = (name, invalid) => {
      root.querySelector(`[data-testid="field-${name}"]`).classList.toggle('invalid', invalid);
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const u = userEl.value.trim();
      const p = passEl.value;
      setInvalid('username', !u);
      setInvalid('password', !p);
      if (!u || !p) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn__spinner"></span> Verificando…';
      setTimeout(() => {
        if (store.login(u, p)) {
          toast('Sesión iniciada correctamente.', 'success', '¡Bienvenido!');
          navigate('/dashboard');
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Entrar';
          setInvalid('password', true);
          root.querySelector('[data-testid="error-password"]').textContent = 'Usuario o contraseña incorrectos.';
          toast('Credenciales inválidas. Intenta de nuevo.', 'error', 'Error de acceso');
        }
      }, 650);
    });
  },
};
