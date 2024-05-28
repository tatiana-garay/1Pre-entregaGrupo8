const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3008;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

const dataFilePath = path.join(__dirname, 'database', 'trailerflix.json');

// Carga los datos del archivo JSON
app.use((req, res, next) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('No se puede leer el archivo de datos:', err);
        return next(err);
      }
  
      try {
        req.trailerflix = JSON.parse(data);
        next();
      } catch (parseErr) {
        console.error('Error al parsear el archivo JSON:', parseErr);
        return next(parseErr);
      }
    });
  });

  //ruta de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

app.get('/catalogo', (req, res) => {
    res.json(req.trailerflix);
  });

    // Normaliza una cadena de texto eliminando tildes y convirtiéndola a minúsculas
function normalizeString(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  
  // Ruta para buscar una película por título
  app.get("/titulo/:title", (req, res) => {
    const title = normalizeString(req.params.title);
    const filteredTitle = req.trailerflix.filter (trailer => trailer.titulo.toLowerCase().includes(title.toLowerCase()));
    if (filteredTitle.length > 0) {
      res.json(filteredTitle.map(trailer => ({ titulo: trailer.titulo, reparto: trailer.reparto })));
    } else {
      res.status(404).json({ error: `¡Lo sentimos! No se encontraron titulos con el nombre "${title}".` });
    }
  });
  

// ruta para buscar categorias
app.get('/categoria/:cat', (req, res) => {
    const cat = normalizeString(req.params.cat);
    const filteredCategory = req.trailerflix.filter(trailer => trailer.categoria.toLowerCase().includes(cat.toLowerCase()));
    if (filteredCategory.length > 0) {
      res.json(filteredCategory.map(trailer => ({ titulo: trailer.titulo, categoria: trailer.categoria })));
    } else {
      res.status(404).json({ error: `¡Lo sentimos! No se encontraron categorias con el nombre "${cat}".` });
    }
  });

//ruta para buscar por reparto
app.get('/reparto/:actor', (req, res) => {
    const actor = normalizeString(req.params.actor);
    const filteredActor = req.trailerflix.filter(trailer => trailer.reparto.toLowerCase().includes(actor.toLowerCase()));
    if (filteredActor.length > 0) {
      res.json(filteredActor.map(trailer => ({ titulo: trailer.titulo, reparto: trailer.reparto })));
    } else {
      res.status(404).json({ error: `¡Lo sentimos! No se encontraron actores con el nombre "${actor}".` });
    }
  });

//ruta para buscar por trailer
app.get('/trailer/:id', (req, res) => {
    const id = normalizeString(req.params.id);
    const filteredActor = req.trailerflix.filter(trailer => trailer.trailer.toLowerCase().includes(id.toLowerCase()));
    if (filteredActor.length > 0) {
      res.json(filteredActor.map(trailer => ({ titulo: trailer.titulo, trailer: trailer.trailer })));
    } else {
      res.status(404).json({ error: `¡Lo sentimos! No se encontraron actores con el nombre "${id}".` });
    }
  });









app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    });