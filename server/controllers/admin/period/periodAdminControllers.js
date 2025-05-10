// controllers/periodoAdminController.js
const db = require('../../../config/db/db');

// Renderiza la vista principal con HBS
exports.renderPeriodoView = async (req, res) => {
  const [periodos] = await db.query("SELECT * FROM view_periodos_admin");
  const [activo] = await db.query("SELECT * FROM view_periodo_activo");
  res.render("layouts/admin/periodos", {
    periodos,
    periodoActivo: activo[0] || null
  });
};

// API: Obtener todos los periodos
exports.getPeriodos = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM view_periodos_admin");
  res.json(rows);
};

// API: Obtener periodo activo
exports.getPeriodoActivo = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM view_periodo_activo");
  res.json(rows[0] || null);
};

// API: Obtener periodo por ID
exports.getPeriodoById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM view_periodo_by_id WHERE idperiodo = ?", [id]);
  res.json(rows[0] || null);
};

// API: Crear nuevo periodo (desactiva anteriores automáticamente)
exports.createPeriodo = async (req, res) => {
  const { nombre, fecha_inicio, fecha_fin } = req.body;
  await db.query("CALL sp_crear_periodo(?, ?, ?)", [nombre, fecha_inicio, fecha_fin]);
  res.status(201).json({ message: "Nuevo periodo creado y activado" });
};

// API: Editar periodo
exports.updatePeriodo = async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha_inicio, fecha_fin } = req.body;
  await db.query("CALL sp_editar_periodo(?, ?, ?, ?)", [id, nombre, fecha_inicio, fecha_fin]);
  res.json({ message: "Periodo actualizado correctamente" });
};
