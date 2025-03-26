const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware essentiel
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration Multer
const storage = multer.memoryStorage(); // Stockage en mémoire pour test
const upload = multer({ storage });

// Route de test
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Route d'upload
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ status: 'success', file: req.file });
});

// Démarrer le serveur
const PORT = 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running → http://${HOST}:${PORT}`);
});