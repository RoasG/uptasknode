const passport = require('../config/passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');

const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'AMBOS campos son Obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

exports.enviarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.render('reestablecer', {
            nombrePagina: 'Reestablecer password',
            mensajes: req.flash()
        });
    } else {
        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion = Date.now() + 3600000;

        await usuario.save();

        const urlReset = `http://${req.headers.host}/reestablecer/${usuario.token}`;

        //enviar el correo con el token
        await enviarEmail.enviar({
            usuario,
            subject: 'Password Reset',
            urlReset,
            archivo: 'reestablecer-password'
        });

        req.flash('correcto', 'Email enviado exitosamente');
        res.render('iniciarSesion', {
            nombrePagina: 'Inicia Sesión en UpTaskNode',
            mensajes: req.flash()
        });
    }
}

exports.resetPasswordForm = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    if (!usuario) {
        req.flash('error', 'NO VALIDO');
        res.redirect('reestablecer');
    } else {
        res.render('resetPassword', {
            nombrePagina: 'Reestablecer contraseña'
        });
    }
}

exports.actualizarPassword = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                //
                [Op.gte]: Date.now()
            }
        }
    });
    if (!usuario) {
        req.flash('error', 'Token NO Válido');
        res.redirect('/reestablecer');
    } else {
        usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        usuario.token = null;
        usuario.expiracion = null;
        await usuario.save();

        req.flash('correcto', 'Password reestablecido correctamente');
        res.render('iniciarSesion', {
            nombrePagina: 'Inicia Sesión en UpTaskNode',
            mensajes: req.flash()
        });
    }
}