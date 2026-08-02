# CLAUDE.md

Guía para trabajar en este repositorio. Complementa al [README](README.md) (que documenta rutas y `data-testid`); aquí se recogen las **convenciones y guardarraíles** no obvios.

## 1. Qué es este proyecto

**Playwright Demo App**: una SPA **100 % front-end** (HTML + CSS + JavaScript puro, sin build, sin dependencias, sin backend) que sirve como campo de práctica para automatización con **Playwright**. Los datos viven en memoria y se reinician al recargar.

## 2. Comandos

Los módulos ES exigen servir por HTTP (no funciona con `file://`).

```bash
python -m http.server 5511
```

```bash
npx serve -l 5511
```

Luego abre <http://localhost:5511>.

- **No hay paso de build**: edita un archivo y recarga el navegador.
- **No hay suite de tests en el repo**: los `data-testid` existen para pruebas Playwright *externas*, no hay `tests/` aquí. Si añades una, no introduzcas dependencias en la app.

## 3. Arquitectura

Mapa mental del flujo:

```
index.html  →  js/app.js (bootstrap: setTheme + render)
                 ├─ router hash-based (ROUTES, currentPath, guardas de auth)
                 ├─ shell(): sidebar + topbar  →  navItem(), wireShell()
                 ├─ js/core/ (store.js, ui.js): núcleo transversal
                 └─ monta la vista activa (js/views/) en #view-content
```

Layout de `js/`: `app.js` es el **entry**; `js/core/` agrupa el estado y los helpers transversales (`store.js`, `ui.js`); `js/views/` contiene las vistas. Las vistas importan del núcleo con `../core/store.js` y `../core/ui.js`.

- **Arranque** — [index.html](index.html) carga `js/app.js` como `type="module"`. Al final, `app.js` hace `setTheme(store.theme)` y `render()`, y escucha `hashchange`.
- **Router hash-based** — en [js/app.js](js/app.js): el mapa `ROUTES` asocia `/ruta → vista`. `currentPath()` deriva la ruta del hash; `render()` aplica **guardas de autenticación** (redirige a `/login` si no hay sesión, y a `/dashboard` si ya la hay).
- **Shell** — `shell(path)` construye sidebar + topbar; `NAV` es una estructura declarativa (`link` o `group` con `children`); `wireShell()` conecta navegación, submenús, tema, dropdowns, logout y búsqueda.
- **Contrato de una Vista** — cada archivo en `js/views/` exporta un objeto con esta forma:

  ```js
  export const miVista = {
    fullscreen: false,          // opcional; true omite el shell (p. ej. login)
    render(ctx) { return `...html...`; },
    mount(root, ctx) { /* listeners, opcional */ },
  };
  ```

  `ctx = { navigate, setTheme, store }`. `render` devuelve HTML como string; `mount` recibe el nodo raíz ya insertado para enganchar eventos.
- **Estado** — [js/core/store.js](js/core/store.js): un único objeto `store` en memoria (auth, users, theme, sidebarCollapsed) con métodos `login/logout/addUser/updateUser/deleteUser/getUser`. Exporta también `CATALOG` (roles, statuses, departments). Sin persistencia ni reactividad.
- **Helpers UI** — [js/core/ui.js](js/core/ui.js): `toast(message, type, title)`, `openModal(opts)`, `confirmDialog(opts)`, `esc(str)`, `closeAllDropdowns(except)`. Son el núcleo transversal: casi toda vista los usa. **Úsalos en vez de reimplementar** toasts/modales.

## 4. Convenciones (reglas duras)

- **`data-testid` obligatorio.** Todo elemento interactivo nuevo (botón, input, fila, modal, toast) debe exponer un `data-testid` estable en kebab-case. Es el propósito del repo: no los quites ni los renombres sin motivo.
- **`esc()` siempre.** Cualquier dato dinámico interpolado en un template literal se pasa por `esc()` antes de inyectarlo como HTML. Evita XSS y roturas de layout.
- **Determinismo.** Prohibido `Math.random()` y `new Date()` sin fecha fija. Los datos semilla se generan con `seededUsers()` (determinista) y las fechas son hardcodeadas, para que las pruebas sean reproducibles.
- **Idioma de la UI: español.** Labels, textos, títulos y mensajes de toast en español.
- **Sin dependencias.** JavaScript puro (ES2020+). No agregues librerías, `package.json`, ni herramientas de build.

## 5. Receta: agregar una vista nueva

1. Crea `js/views/<nombre>.js` siguiendo el **contrato de Vista** (§3).
2. Impórtala y regístrala en `ROUTES` y `PAGE_TITLES` en [js/app.js](js/app.js).
3. Añade su entrada en `NAV` (con `icon`, `label`, `path` y `testid`).
4. Expón `data-testid` en cada control de la vista.

## 6. Gotchas

- El estado se **reinicia al recargar** (todo es en memoria).
- Credenciales demo: usuario `admin`, contraseña `playwright`.
- La vista `login` usa `fullscreen: true`, por lo que **omite el shell** (sin sidebar/topbar).
- El `store` es un único objeto global mutable **sin reactividad**: tras cambiar estado hay que re-renderizar manualmente (`ctx.navigate(...)` o volver a llamar `render`).
- Los `data-testid` de listas usan sufijos dinámicos (`user-row-{id}`, `btn-edit-{id}`, `page-{n}`): mantén ese patrón al generar filas.
