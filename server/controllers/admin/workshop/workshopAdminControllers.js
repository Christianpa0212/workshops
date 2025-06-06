const db = require('../../../config/db/db');

// Renderiza la vista principal de talleres (Admin)
exports.renderTalleresView = async (req, res) => {
  const [periodoActivo] = await db.query('SELECT * FROM view_periodo_activo');
  res.render('layouts/admin/talleres', {
    periodoActivo: periodoActivo[0] || null
  });
};


// Obtener todos los talleres (admin)
exports.getTalleres = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM view_talleres_admin');
  res.json(rows);
};

// Obtener un taller por ID
exports.getTallerById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query('SELECT * FROM view_taller_by_id WHERE idtaller = ?', [id]);
  res.json(rows[0] || null);
};

// Obtener lista de talleristas (para <select>)
exports.getTalleristas = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM view_talleristas_dropdown');
  res.json(rows);
};

// Crear nuevo taller
exports.createTaller = async (req, res) => {
  const { nombre, descripcion, fecha, hora, cupo_maximo, idtallerista, idperiodo } = req.body;

  await db.query('CALL sp_crear_taller(?, ?, ?, ?, ?, ?, ?)', [
    nombre, descripcion, fecha, hora, cupo_maximo, idtallerista, idperiodo
  ]);

  res.status(201).json({ message: 'Taller creado correctamente' });
};

// Editar taller
exports.editTaller = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, fecha, hora, cupo_maximo, idtallerista } = req.body;

  await db.query('CALL sp_editar_taller(?, ?, ?, ?, ?, ?, ?)', [
    id, nombre, descripcion, fecha, hora, cupo_maximo, idtallerista
  ]);

  res.json({ message: 'Taller actualizado correctamente' });
};

// Cambiar estado del taller
exports.changeEstadoTaller = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    // 1. Cambiar el estado del taller (usando tu procedimiento almacenado)
    await db.query('CALL sp_cambiar_estado_taller(?, ?)', [id, estado]);

    // 2. Si el estado nuevo es 'cancelado', enviar notificación por correo
    if (estado === 'cancelado') {
      const notificarCancelacionTaller = require('../utils/notificarCancelacion');
      await notificarCancelacionTaller(id); // ID del taller
    }

    res.json({ message: `Taller marcado como ${estado}` });
  } catch (error) {
    console.error("❌ Error al cambiar estado del taller:", error);
    res.status(500).json({ error: 'No se pudo cambiar el estado del taller' });
  }
};
