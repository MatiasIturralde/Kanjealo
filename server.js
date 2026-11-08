/**
 * Kanjealo V5 - Servidor local opcional en Node.js
 * Sirve los archivos estáticos en el puerto 5500 (idéntico a Live Server).
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

// Servir todos los archivos estáticos del proyecto
app.use(express.static(__dirname));

// Fallback a index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log('================================================================');
  console.log(` Kanjealo V5 servidor local iniciado`);
  console.log(` Accedé en: http://127.0.0.1:${PORT}/`);
  console.log(` Compatible con Live Server (puerto ${PORT})`);
  console.log('================================================================');
});
