const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//variables de entorno
require('dotenv').config({ path: 'variables.env' });

const db = require('./config/database');
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
db.sync()
    .then(() => console.log('GOOD'))
    .catch(error => console.log(error))

const app = express();

app.use(express.static('public'));

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));


app.set('views', path.join(__dirname, './views'));

app.use(flash());

app.use(cookieParser());

//sessiones, nos permiten navegar sin volver a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

//autenticacion de usuarios
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null;
    next();
});

app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor ta good');
});