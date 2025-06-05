const db = require('../../../config/db/db');

// Renderizar vista de talleres del tallerista
/*exports.renderWorkshopsView = async (req, res) => {
  res.render('layouts/tallerist/talleres'); // Ajusta si tu ruta cambia
};*/

// Renderizar vista de talleres del tallerista
exports.renderWorkshopsView = async (req, res) => {
  try {
    const [periodoActivo] = await db.query('SELECT * FROM view_periodo_activo');
    res.render('layouts/tallerist/talleres', {
      periodoActivo: periodoActivo[0] || null
    });
  } catch (error) {
    console.error('❌ Error al cargar periodo activo:', error);
    res.status(500).send('Error al cargar la vista de talleres');
  }
};


// Crear taller
exports.crearTaller = async (req, res) => {
  const idtallerista = req.session.user.id; 
  /*const { nombre, descripcion, fecha, hora, cupo_maximo } = req.body;
  await db.query('CALL sp_crear_taller_tallerista(?, ?, ?, ?, ?, ?)', [
    nombre, descripcion, fecha, hora, cupo_maximo, idtallerista
  ]);*/
  //
  const { nombre, descripcion, fecha, hora, cupo_maximo, idperiodo } = req.body;
await db.query('CALL sp_crear_taller_tallerista(?, ?, ?, ?, ?, ?, ?)', [
  nombre, descripcion, fecha, hora, cupo_maximo, idtallerista, idperiodo
]);

  res.status(201).json({ message: 'Taller creado correctamente' });
};

// Ver talleres propios
exports.getTalleresPropios = async (req, res) => {
  const idtallerista = req.session.user.id; 
  const [rows] = await db.query('SELECT * FROM view_taller_by_id WHERE idtallerista = ?', [idtallerista]);
  res.json(rows);
};

// Cancelar taller
exports.cancelarTaller = async (req, res) => {
  const { idtaller } = req.params;
  await db.query('CALL sp_cambiar_estado_taller(?, ?)', [idtaller, 'canceled']);
  res.json({ message: 'Taller cancelado correctamente' });
};

// Ver inscritos
exports.getInscritosTaller = async (req, res) => {
  const { idtaller } = req.params;
  const [rows] = await db.query('SELECT * FROM view_inscritos_por_taller WHERE idtaller = ?', [idtaller]);
  res.json(rows);
};

// Marcar asistencia
exports.marcarAsistencias = async (req, res) => {
  const { asistencias } = req.body;
  for (const a of asistencias) {
    await db.query('CALL sp_marcar_asistencia(?, ?)', [a.idinscripcion, a.asistencia]);
  }
  res.json({ message: 'Asistencias registradas correctamente' });
};



// Obtener taller por ID
exports.getTallerById = async (req, res) => {
  const { idtaller } = req.params;
  const [rows] = await db.query('SELECT * FROM view_taller_by_id WHERE idtaller = ?', [idtaller]);
  if (rows.length === 0) return res.status(404).json({ error: 'Taller no encontrado' });
  res.json(rows[0]);
};

// Editar taller 
exports.editarTaller = async (req, res) => {
  const { idtaller } = req.params;
  const { nombre, descripcion, fecha, hora, cupo_maximo, idperiodo } = req.body;

  await db.query('CALL sp_editar_taller_tallerista(?, ?, ?, ?, ?, ?)', [
    idtaller, nombre, descripcion, fecha, hora, cupo_maximo
  ]);

  res.json({ message: 'Taller actualizado correctamente' });
};
