const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    });
}

exports.crearCuenta = async(req, res) => {
    const { email, password } = req.body;

    try {
        await Usuarios.create({
            email,
            password
        });
        //crear la url para confirmar
        const confirmUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario para pasar el correo
        const usuario = {
            email
        }

        //enviar el e-mail
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar Cuenta',
            confirmUrl,
            archivo: 'confirmar-cuenta'
        });

        //redirigir al usuario
        req.flash('correcto', 'Enviamos un email, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        //console.log(req.flash());
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        });
    }
}

exports.iniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Inicia sesión en UpTask',
        error
    });
}

exports.formReestablecer = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer Contraseña'
    });
}

exports.confirmarCuenta = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if (!usuario) {
        req.flash('error', 'Correo no valido');
        res.redirect('/crear-cuenta');
    } else {
        usuario.activo = 1;
        await usuario.save();
        req.flash('correcto', 'Correo validado correctamente');
        res.redirect('/iniciar-sesion');
    }
}