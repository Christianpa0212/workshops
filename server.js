require('dotenv').config();
const express = require('express');
const session = require('express-session');


// Servidor play
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}`);
});