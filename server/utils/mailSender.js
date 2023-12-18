import hbs from "nodemailer-express-handlebars";
import nodemailer from "nodemailer";
import path from "path";
import logger from "../services/logger.service.js";
import { enviromentConfig } from "../config/enviromentConfig.js";
import { handlebarsConfig } from "../config/handlebarsConfig.js";

// create nodemailer transport
const ms_transporter = nodemailer.createTransport({
  host: enviromentConfig.smtp.server,
  port: enviromentConfig.smtp.port,
  secure: false, // use TLS
  auth: {
    user: enviromentConfig.smtp.userName,
    pass: enviromentConfig.smtp.password,
  },
});

// use a template file with nodemailer
ms_transporter.use("compile", hbs(handlebarsConfig));

export async function sendConfirmMail(User) {
  const ms_mailOptions = {
    from: enviromentConfig.smtp.senderAddress, // sender address
    template: "confirmEmail", // the name of the template file, i.e., email.handlebars
    to: User.email,
    subject: `Please verify your email address...`,
    context: {
      confirmUrl: enviromentConfig.app.confirmUrl + "?email=" + User.email + "&token=" + User.emailVerifyToken + "&_id=" + User._id,
      appName: enviromentConfig.app.appName,
      companyName: enviromentConfig.app.companyName,
      companyStreet: enviromentConfig.app.companyStreet,
      companyTown: enviromentConfig.app.companyTown,
      privacyPolicyUrl: enviromentConfig.app.privacyPolicyUrl,
      firstName: User.firstName,
      lastName: User.lastName,
    },
    attachments: [
      {
        filename: "email_blue.png",
        path: "mailImages/email_blue.png",
        cid: "logo",
      },
    ],
  };

  try {
    await ms_transporter.sendMail(ms_mailOptions);
    logger.info("MAIL | Successfully sent Confirm mail to " + User.email);
  } catch (error) {
    logger.error("MAIL | Error sending Confirm mail to " + User.email + ": " + error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
}

export async function sendPwResetMail(user, token) {
  const ms_mailOptions = {
    from: enviromentConfig.smtp.senderAddress, // sender address
    template: "resetPw1", // the name of the template file, i.e., email.handlebars
    to: user.email,
    subject: `Please complete your password reset...`,
    context: {
      confirmUrl: enviromentConfig.app.confirmUrl + "/ForgotPw2?email=" + user.email + "&token=" + token,
      appName: enviromentConfig.app.appName,
      companyName: enviromentConfig.app.companyName,
      companyStreet: enviromentConfig.app.companyStreet,
      companyTown: enviromentConfig.app.companyTown,
      privacyPolicyUrl: enviromentConfig.app.privacyPolicyUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    attachments: [
      {
        filename: "email_blue.png",
        path: "mailImages/email_blue.png",
        cid: "logo",
      },
    ],
  };

  try {
    await ms_transporter.sendMail(ms_mailOptions);
    logger.info("MAIL | Successfully send password reset mail to " + user.email);
  } catch (error) {
    logger.error("MAIL | Error sending password reset mail to " + User.email + ": " + error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
}
