// server/cronjobs.js
const cron = require('node-cron');
const notificarTalleristas = require('./server/scripts/notificarTalleristas');

cron.schedule('0 6-12 * * 1-5', () => {
  console.log("⏰ Ejecutando notificación de talleres sin inscritos...");
  notificarTalleristas();
});
