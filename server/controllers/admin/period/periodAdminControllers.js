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

exports.createPeriodo = async (req, res) => {
  try {
    const { nombre, fecha_inicio, fecha_fin } = req.body;

    // Obtener el periodo activo
    const [activoResult] = await db.query("SELECT * FROM view_periodo_activo");

    if (activoResult.length > 0) {
      const activo = activoResult[0];
      let fechaFinActivo = activo.fecha_fin;

      // Si la fecha viene como string tipo dd/mm/yyyy → la transformamos a yyyy-mm-dd
      if (typeof fechaFinActivo === "string" && fechaFinActivo.includes("/")) {
        const [dd, mm, yyyy] = fechaFinActivo.split("/");
        fechaFinActivo = `${yyyy}-${mm}-${dd}`;
      }

      // Obtener fecha actual en formato yyyy-mm-dd
      const hoy = new Date().toISOString().split("T")[0];

      if (hoy < fechaFinActivo) {
        return res.status(400).json({
          error: `No se puede crear un nuevo periodo hasta que finalice el actual (${activo.nombre}), que termina el ${activo.fecha_fin}.`
        });
      }
    }

    // Si pasa validación, crear el nuevo periodo
    await db.query("CALL sp_crear_periodo(?, ?, ?)", [nombre, fecha_inicio, fecha_fin]);
    res.status(201).json({ message: "Nuevo periodo creado y activado" });

  } catch (error) {
    console.error("Error al crear periodo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



// API: Editar periodo
exports.updatePeriodo = async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha_inicio, fecha_fin } = req.body;
  await db.query("CALL sp_editar_periodo(?, ?, ?, ?)", [id, nombre, fecha_inicio, fecha_fin]);
  res.json({ message: "Periodo actualizado correctamente" });
};
