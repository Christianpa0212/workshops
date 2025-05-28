const db = require('../../../config/db/db');

// ===============================
// Renderizar vista de talleres del alumno
// ===============================
exports.renderWorkshopsView = async (req, res) => {
  res.render('layouts/student/talleres');
};

// ===============================
// Obtener talleres activos para el calendario
// ===============================
exports.getTalleresParaCalendario = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM view_taller_by_id');
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al cargar talleres para calendario:", error);
    res.status(500).json({ error: 'Error al obtener talleres' });
  }
};

// ===============================
// Obtener inscripciones del alumno (tabla)
// ===============================
exports.getMisInscripciones = async (req, res) => {
  const idalumno = req.session.user.id;
  try {
    const [rows] = await db.query('SELECT * FROM view_inscripciones_alumno WHERE idalumno = ?', [idalumno]);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener inscripciones:', error);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
};

// ===============================
// Inscribirse a un taller
// ===============================
exports.inscribirseTaller = async (req, res) => {
  const idalumno = req.session.user.id;
  const { idtaller } = req.params;

  try {
    await db.query('CALL sp_inscribirse_taller(?, ?)', [idalumno, idtaller]);
    res.status(201).json({ message: 'Inscripción exitosa' });
  } catch (error) {
    console.error('❌ Error al inscribirse:', error);
    res.status(400).json({ error: error.sqlMessage || 'No se pudo inscribir' });
  }
};

// ===============================
// Cancelar inscripción
// ===============================
exports.cancelarInscripcion = async (req, res) => {
  const { idinscripcion } = req.params;

  try {
    await db.query('CALL sp_cancelar_inscripcion(?)', [idinscripcion]);
    res.json({ message: 'Inscripción cancelada' });
  } catch (error) {
    console.error('❌ Error al cancelar inscripción:', error);
    res.status(400).json({ error: error.sqlMessage || 'No se pudo cancelar' });
  }
};

// ===============================
// Verifica si el alumno está inscrito y obtiene estado del taller
// ===============================
exports.verificarInscripcion = async (req, res) => {
  const idalumno = req.session.user.id;
  const { idtaller } = req.params;

  try {
    // Obtener inscripción si existe
    const [inscripciones] = await db.query(
      'SELECT idinscripcion FROM inscripciones WHERE idalumno = ? AND idtaller = ? AND estatus = "inscrito"',
      [idalumno, idtaller]
    );

    // Obtener estado del taller
    const [tallerInfo] = await db.query(
      'SELECT estado FROM talleres WHERE idtaller = ?',
      [idtaller]
    );

    const response = {
      inscrito: inscripciones.length > 0,
      estado: tallerInfo.length > 0 ? tallerInfo[0].estado : 'desconocido'
    };

    if (response.inscrito) {
      response.idinscripcion = inscripciones[0].idinscripcion;
    }

    res.json(response);
  } catch (error) {
    console.error('❌ Error verificando inscripción:', error);
    res.status(500).json({ error: 'Error al verificar inscripción' });
  }
};

// ===============================
// Obtener detalles de una inscripción por ID
// ===============================
exports.getInscripcionById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM view_inscripciones_alumno WHERE idinscripcion = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener inscripción:", error);
    res.status(500).json({ error: 'Error al obtener inscripción' });
  }
};