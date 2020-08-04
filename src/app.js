const express = require('express');
const { json } = require('express');
const morgan = require('morgan');
//importando rutas
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const imagesRoutes = require('./routes/images');
const serviceRoutes = require('./routes/services');
const contactsRoutes = require('./routes/contacts');
const usersRoutes = require('./routes/users');
const path = require('path');

//inicializacion
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(json());
app.use(express.urlencoded({extended: false}));
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//routes
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/images', imagesRoutes);
app.use('/services', serviceRoutes);
app.use('/contacts', contactsRoutes);
app.use('/users', usersRoutes);
//servir archivos de imágenes
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;