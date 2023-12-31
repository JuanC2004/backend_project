const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const { API_VERSION } = require("./constants");

// Importamos las rutas
const authRoutes = require('./routes/auth'); 
const userRoutes = require("./routes/user");
const itemRoutes = require("./routes/item");

//Configuramos bodyParser para que convierta el body de nuestras peticiones a JSON
app.use(bodyParser.json());
/* app.use(exp.urlencoded({extended:true})); */
/* app.use(express.json);
app.use(express.urlencoded({ extended:true })); */

//evitar bloqueos con el navegador cuando se trabaje frontend y backend al tiempo
app.use(cors());
console.log(`api/${API_VERSION}`);
// Cargamos las rutas
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, itemRoutes);
// exportamos este módulo para poder usar la variable app fuera de este archivo
module.exports = app;
