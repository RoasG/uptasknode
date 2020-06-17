const express = require('express');
const router = express.Router();
//PARA LAS VALIDACIONES Y SANITIZAR LOS DATOS
const { body } = require('express-validator');


//LOS CONTROLADORES
const homeController = require('../controllers/homeController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {

    router.get('/',
        authController.usuarioAutenticado,
        homeController.primerMetodo
    );
    //agregar PROYECTO
    router.get('/nuevo-proyecto', authController.usuarioAutenticado, homeController.nuevoProyecto);
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        homeController.agregarProyecto);

    //obtener PROYECTO por URL        
    router.get('/proyectos/:url', authController.usuarioAutenticado, homeController.proyecto);

    //editar PROYECTO por ID
    router.get('/proyectos/editar/:id', authController.usuarioAutenticado, homeController.formularioEditar);
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        homeController.actualizarProyecto);

    //Eliminar PROYECTO por ID
    router.delete('/proyectos/:url', authController.usuarioAutenticado, homeController.eliminarProyecto);

    //Agregar TAREAS
    router.post('/proyectos/:url', authController.usuarioAutenticado, tareasController.agregarTarea);
    //Cambiar ESTADO tareas
    router.patch('/tareas/:id', authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);
    //Eliminar TAREAS
    router.delete('/tareas/:id', authController.usuarioAutenticado, tareasController.eliminarTarea);

    //CREAR CUENTA
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.iniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Cerrar Sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //Reestablecer contraseña
    router.get('/reestablecer', usuariosController.formReestablecer);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.resetPasswordForm);
    router.post('/reestablecer/:token', authController.actualizarPassword);

    return router;
}