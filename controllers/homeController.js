const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.primerMetodo = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    res.render("index", {
        nombrePagina: "Proyectos",
        proyectos,
    });
};

exports.nuevoProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    res.render("nuevoProy", {
        nombrePagina: "Nuevo Proyecto",
        proyectos,
    });
};

exports.agregarProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    const { nombre } = req.body;

    let errores = [];

    if (nombre.length === 0) {
        errores.push({ texto: "INGRESE UN NOMBRE" });
    }
    if (errores.length > 0) {
        res.render("nuevoProy", {
            nombrePagina: "Nuevo Proyecto",
            errores,
            proyectos
        });
    } else {
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });

        res.redirect("/");
    }
};

exports.proyecto = async(req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        },
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Cargar las tareas
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
    })

    if (!proyecto) return next();

    res.render("tareas", {
        nombrePagina: `Tareas del Proyecto`,
        proyectos,
        proyecto,
        tareas
    });
};

exports.formularioEditar = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        },
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render("nuevoProy", {
        nombrePagina: `Editar Proyecto`,
        proyectos,
        proyecto
    });
}

exports.actualizarProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });

    const { nombre } = req.body;
    let errores = [];

    if (nombre.length === 0) {
        errores.push({ texto: 'Agregue un nombre' });
    }
    if (errores.length > 0) {
        res.render("nuevoProy", {
            nombrePagina: 'Editar proyecto',
            errores,
            proyectos
        });
    } else {
        await Proyectos.update({ nombre: nombre }, { where: { id: req.params.id } });

        res.redirect("/");
    }
}

exports.eliminarProyecto = async(req, res, next) => {
    const resultado = await Proyectos.destroy({
        where: {
            //query o params
            url: req.params.url
        }
    });

    if (!resultado) {
        return next();
    }

    res.send("El proyecto se ha eliminado correctamente");
}