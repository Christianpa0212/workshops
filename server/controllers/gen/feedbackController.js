const fs = require('fs');
const path = require('path');

exports.guardarValoracion = (req, res) => {
  const { estrellas } = req.body;

  if (!estrellas) {
    return res.status(400).json({ mensaje: 'Valor no válido' });
  }

  const ruta = path.join(__dirname, '../data/valoraciones.txt');
  const linea = `Valoración: ${estrellas} estrellas - ${new Date().toISOString()}\n`;

  fs.appendFile(ruta, linea, (err) => {
    if (err) {
      console.error('Error al guardar la valoración:', err);
      return res.status(500).json({ mensaje: 'Error al guardar la valoración' });
    }

    res.json({ mensaje: '¡Gracias por tu calificación!' });
  });
};
