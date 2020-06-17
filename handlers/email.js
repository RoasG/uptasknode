const nodemailer = require('nodemailer');
const juice = require('juice');
const pug = require('pug');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

//generar el ASHETEMELE
const generarHtml = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/mails/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async(opciones) => {
    const html = generarHtml(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    let mailOptions = {
        from: 'UpTask <no-reply@uptask.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html
    }

    const enviarEmail = util.promisify(transporter.sendMail, transporter);

    return enviarEmail.call(transporter, mailOptions);
}