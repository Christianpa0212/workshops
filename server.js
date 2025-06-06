require('dotenv').config();
require('./cronjobs');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const hbs = require('hbs');

// Rutas y conexión BD
const rutas = require('./server/routes/allRoutes');
require('./server/config/db/db');

const app = express();

// ============================
// Configuración de sesión
// ============================
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// ============================
// Middlewares
// ============================
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============================
// Variables globales en vistas
// ============================
app.use((req, res, next) => {
  res.locals.usuario = req.session.user || null;
  next();
});

// ============================
// Archivos estáticos
// ============================
app.use(express.static(path.join(__dirname, 'client/public')));

// ============================
// Configuración HBS
// ============================
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'client/views'));
hbs.registerPartials(path.join(__dirname, 'client/views/partials'));

// Helpers HBS
hbs.registerHelper('eq', (a, b) => a === b);
hbs.registerHelper('concat', (a, b) => `${a}${b}`);

// ============================
// Rutas
// ============================
app.use('/', rutas);

// ============================
// Inicio del servidor
// ============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
