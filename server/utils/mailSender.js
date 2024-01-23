import hbs from "nodemailer-express-handlebars";
import nodemailer from "nodemailer";
import path from "path";
import logger from "../services/logger.service.js";
import { enviromentConfig } from "../config/enviromentConfig.js";
import { handlebarsConfig } from "../config/handlebarsConfig.js";
import Setting from "../models/Setting.js";
import e from "express";

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

// method to check if we have to send a object change notification
export async function sendNotifOnObjectUpdate() {
  var sett = await Setting.find({ scope: "notif" });
  if (sett.length > 0) {
    if (sett.sendNotifOnObjectUpdate === "true") {
      return true;
    } else {
      return false;
    }
  }
}

// method to check if we have to send a self register notification
export async function sendNotifOnUserSelfRegister() {
  var sett = await Setting.find({ scope: "notif" });
  if (sett.length > 0) {
    if (sett.sendNotifOnUserSelfRegister === "true") {
      return true;
    } else {
      return false;
    }
  }
}

// method to check if we have to send a object creation notification
export async function sendNotifOnObjectCreation() {
  var sett = await Setting.find({ scope: "notif" });
  if (sett.length > 0) {
    if (sett.sendNotifOnObjectCreation === "true") {
      return true;
    } else {
      return false;
    }
  }
}

// method to check if we have to send a object delete notification
export async function sendNotifOnObjectDeletion() {
  var sett = await Setting.find({ scope: "notif" });
  if (sett.length > 0) {
    if (sett.sendNotifOnObjectDeletion === "true") {
      return true;
    } else {
      return false;
    }
  }
}

// method to check if we have to send a user creation welcome notification
export async function sendWelcomeMailOnUserCreation() {
  var sett = await Setting.find({ scope: "notif" });
  if (sett.length > 0) {
    if (sett.sendWelcomeMailOnUserCreation === "true") {
      return true;
    } else {
      return false;
    }
  }
}

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

export async function sendWelcomeMail(user) {
  const ms_mailOptions = {
    from: enviromentConfig.smtp.senderAddress, // sender address
    template: "welcome", // the name of the template file, i.e., email.handlebars
    to: user.email,
    subject: "Welcome to " + enviromentConfig.app.appName + "...",
    context: {
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
    logger.info("MAIL | Successfully send welcome mail to " + user.email);
  } catch (error) {
    logger.error("MAIL | Error sending welcome mail to " + User.email + ": " + error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
}

export async function sendObjectMail(objectName, objectType, action) {
  var sett = await Setting.find({ scope: "notif" });
  const ms_mailOptions = {
    from: enviromentConfig.smtp.senderAddress, // sender address
    template: "object", // the name of the template file, i.e., email.handlebars
    to: sett.notifReceiver,
    subject: "PAn object has been " + action + " ...",
    context: {
      appName: enviromentConfig.app.appName,
      companyName: enviromentConfig.app.companyName,
      companyStreet: enviromentConfig.app.companyStreet,
      companyTown: enviromentConfig.app.companyTown,
      privacyPolicyUrl: enviromentConfig.app.privacyPolicyUrl,
      objectName: objectName,
      objectType: objectType,
      action: action,
      firstName: sett.notifReceiverFirstname,
      lastName: sett.notifReceiverLastname,
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
    logger.info("MAIL | Successfully send object " + action + " mail to " + user.email);
  } catch (error) {
    logger.error("MAIL | Error sending object " + action + " mail to " + User.email + ": " + error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
}
