import hbs  from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';
import dotenv from "dotenv";
import logger from "../services/logger.service.js";

// load enviroment variables
dotenv.config();

// create nodemailer transport
const ms_transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: false, // use TLS
    auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
    },
});

// point to the template folder
const ms_handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./mailTemplates/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./mailTemplates/'),
};

// use a template file with nodemailer
ms_transporter.use('compile', hbs(ms_handlebarOptions));

export async function SendConfirmMail(User) {
    const ms_mailOptions = {
        from: process.env.SMTP_SENDERADDRESS, // sender address
        template: "confirmEmail", // the name of the template file, i.e., email.handlebars
        to: User.email,
        subject: `Please verify your email address...`,
        context: {
            confirmUrl: process.env.SMTP_CONFIRM_CLIENTURL + '?email=' + User.email + '&token=' + User.emailVerifyToken + '&_id=' + User._id,
            appName: process.env.APPLICATION_SWAGGER_APPNAME,
            companyName: process.env.APPLICATION_COMPANYNAME,
            companyStreet: process.env.APPLICATION_COMPANYSTREET,
            companyTown: process.env.APPLICATION_COMPANYTOWN,
            privacyPolicyUrl: process.env.APPLICATION_PRIVACYPOLICY_URL,
            firstName: User.firstName,
            lastName: User.lastName
        },
        attachments: [{
            filename: 'email_blue.png',
            path: 'mailImages/email_blue.png',
            cid: 'logo' 
       }],
    };

    await ms_transporter.sendMail(ms_mailOptions);
    logger.info("MAIL | Successfully send Confirm mail to " + User.email);
}

export async function sendPwResetMail(user, token) {
    const ms_mailOptions = {
        from: process.env.SMTP_SENDERADDRESS, // sender address
        template: "resetPw1", // the name of the template file, i.e., email.handlebars
        to: user.email,
        subject: `Please complete your password reset...`,
        context: {
            confirmUrl: process.env.APPLICATION_CLIENT_URL + '/ForgotPw2?email=' + user.email + '&token=' + token,
            appName: process.env.APPLICATION_SWAGGER_APPNAME,
            companyName: process.env.APPLICATION_COMPANYNAME,
            companyStreet: process.env.APPLICATION_COMPANYSTREET,
            companyTown: process.env.APPLICATION_COMPANYTOWN,
            privacyPolicyUrl: process.env.APPLICATION_PRIVACYPOLICY_URL,
            firstName: user.firstName,
            lastName: user.lastName
        },
        attachments: [{
            filename: 'email_blue.png',
            path: 'mailImages/email_blue.png',
            cid: 'logo' 
       }],
    };

    await ms_transporter.sendMail(ms_mailOptions);
    logger.info("MAIL | Successfully send password reset to " + user.email);
}
