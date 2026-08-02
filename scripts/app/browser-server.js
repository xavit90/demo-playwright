// ============================================================
// Servidor de navegador persistente.
// Lanza un Chromium (headed) que permanece abierto y publica su
// wsEndpoint en el archivo .browser-ws. La suite lo reutiliza vía
// connectOptions (ver playwright.config.js), en lugar de abrir y
// cerrar un navegador nuevo en cada corrida.
//
//   node scripts/app/browser-server.js   (o: npm run browser:open)
//
// Déjalo corriendo en una terminal; ejecuta `npm test` en otra.
// Ctrl+C aquí cierra el navegador y borra .browser-ws.
// ============================================================
import { chromium } from '@playwright/test';
import { writeFileSync, rmSync } from 'node:fs';

const WS_FILE = '.browser-ws';

const server = await chromium.launchServer({ headless: false });
const ws = server.wsEndpoint();
writeFileSync(WS_FILE, ws, 'utf8');

console.log('✅ Navegador persistente abierto.');
console.log('   wsEndpoint: ' + ws);
console.log('   Endpoint guardado en ' + WS_FILE);
console.log('   Ahora ejecuta `npm test` en otra terminal (se conectará a este navegador).');
console.log('   Ctrl+C para cerrarlo.');

const shutdown = async () => {
  try { rmSync(WS_FILE, { force: true }); } catch {}
  await server.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
