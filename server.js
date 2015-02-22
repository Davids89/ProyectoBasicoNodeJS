//server.js

//configuracion

//primero importamos las herramientas que necesitamos

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose'); //mongoose nos permitira trabajar con MongoDB de una forma muy fácil
var passport = require('passport'); //nos ayudará a autenticarnos de varias maneras
var flash = require('connect-flash'); //almacena mensajes de forma temporal

var morgan = require('morgan'); //middleware para HTTP request
var cookieParser = require('cookie-parser'); //para parsear cookies
var bodyParser = require('body-parser'); //middleware para parsear bodies
var session = require('express-session'); //middleware para las sesiones

//==========CONEXION CON LA BASE DE DATOS=============

var database = require('./config/database.js'); //en este archivo guardamos la config de la BBDD
mongoose.connect(database.url); //cogemos el atributo de url para hacer la conexion

require('./config/passport')(passport); //cogemos el passport para la configuracion

//==========CONFIGURACION DE EXPRESS=============

app.use(morgan('dev')); //para ver cada request en la consola
app.use(cookieParser()); //leemos las cookies (necesario para auth)
app.use(bodyParser()); //para coger informacion de los formularios

app.set('view engine', 'ejs'); //elegimos como motor de template jade

//==========PASSPORT=============

app.use(session({ secret : 'ilovescotchscotchyscotchscotch' })); //este es el hash
app.use(passport.initialize());
app.use(passport.session()); //para que las sesiones sean persistentes
app.use(flash()); //usamos connect-flash para mensajes flash almacenados en session

//==========ROUTES=============

require('./app/routes.js')(app, passport); //vamos a cargar las rutas en un archivo aparte y pasamos app y passport ya configuradas

//==========ARRANQUE=============

app.listen(port);
console.log('Servidor funcionando en el puerto ' + port);