const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();


const port = process.env.PORT || 3008;

app.set('views engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));


app.use((req, res, next) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('No se puede leer el archivo de datos:', err);
        return next(err);
      }
  
      try {
        req.TRAILERFLIX = JSON.parse(data);
        next();
      } catch (parseErr) {
        console.error('Error al parsear el archivo JSON:', parseErr);
        return next(parseErr);
      }
    });
  });
  
  // Función para normalizar strings con tildes
  function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  
  // Rutas
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });
  
  app.get('/catalogo', (req, res) => {
    res.json(req.TRAILERFLIX);
  });
  
  app.get("/titulo/:title", (req, res) => {
    const title = normalizeString(req.params.title);
    const filteredTitle = req.TRAILERFLIX.filter(trailer => normalizeString(trailer.titulo).includes(title));
    if (filteredTitle.length > 0) {
      res.json(filteredTitle.map(trailer => ({ titulo: trailer.titulo, reparto: trailer.reparto })));
    } else {
      res.status(404).json({ error: `¡Lo sentimos! No se encontraron titulos con el nombre "${title}".` });
    }
  });
  
  app.get("/categoria/:cat", (req, res) => {
    const cat = normalizeString(req.params.cat);
    const filteredCategoria = req.TRAILERFLIX.filter(trailer => normalizeString(trailer.categoria).includes(cat));
    if (filteredCategoria.length > 0) {
      res.json(filteredCategoria);
    } else {
      res.status(404).json({ error: `¡Lo sentimos! No se encontraron ocurrencias en la categoría "${cat}".` });
    }
  });
  
  app.get("/reparto/:act", (req, res) => {
    const act = normalizeString(req.params.act);
    const filteredActores = req.TRAILERFLIX.filter(trailer => normalizeString(trailer.reparto).includes(act));
    
    if (filteredActores.length > 0) {
      res.json(filteredActores.map(trailer => ({ titulo: trailer.titulo, reparto: trailer.reparto })));
    } else {
      res.status(404).json({ error: `¡Lo sentimos! No se encontraron referencias de "${act}".` });
    }
  });
  
  app.get("/trailer/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const filteredId = req.TRAILERFLIX.find(item => item.id === id);
    if (filteredId) {
      const result = {
        id: filteredId.id,
        titulo: filteredId.titulo,
        trailer: filteredId.trailer || null
      };
      res.json(result);
    } else {
      res.status(404).json({ error: `¡Lo sentimos! No se encontró ninguna serie o película con el ID "${id}".` });
    }
  });
  
  // Manejo error de ruta no encontrada
  app.use((req, res) => {
    res.status(404).json({ error: 'Lo sentimos, no encontramos lo que buscas, intenta de nuevo. ' });
  });

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    });