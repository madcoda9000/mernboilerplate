import hbs from "nodemailer-express-handlebars"
import nodemailer from "nodemailer"
import path from "path"
import logger from "../services/logger.service.js"
import { enviromentConfig } from "../config/enviromentConfig.js"
import { handlebarsConfig } from "../config/handlebarsConfig.js"
import Setting from "../models/Setting.js"
import e from "express"

async function getSmtpConfigFromDatabase() {
  // Annahme: Die Datenbank enthält Werte für host, port, userName und password
  const smtpConfig = await Setting.find({ scope: "mail" })

  return {
    host: smtpConfig.find((config) => config.name === "smtpServer").value,
    port: smtpConfig.find((config) => config.name === "smtpPort").value,
    secure: false, // use TLS! If set to true here, ssl will be used
    auth: {
      user: smtpConfig.find((config) => config.name === "smtpUsername").value,
      pass: smtpConfig.find((config) => config.name === "smtpPassword").value,
    },
  }
}

// create nodemailer transport
async function createTransporter() {
  const smtpConfig = await getSmtpConfigFromDatabase()

  // create nodemailer transport
  const ms_transporter = nodemailer.createTransport(smtpConfig)

  // use a template file with nodemailer
  ms_transporter.use("compile", hbs(handlebarsConfig))

  return ms_transporter
}

// method to check if we have to send a object change notification
export async function sendNotifOnObjectUpdate() {
  var sett = await Setting.find({ scope: "notif", name: "sendNotifOnObjectUpdate" })
  if (sett.length > 0) {
    if (sett[0].value === "true") {
      return true
    } else {
      return false
    }
  }
}

// method to check if we have to send a self register notification
export async function sendNotifOnUserSelfRegister() {
  var sett = await Setting.find({ scope: "notif", name: "sendNotifOnUserSelfRegister" })
  if (sett.length > 0) {
    if (sett[0].value === "true") {
      return true
    } else {
      return false
    }
  }
}

// method to check if we have to send a object creation notification
export async function sendNotifOnObjectCreation() {
  var sett = await Setting.find({ scope: "notif", name: "sendNotifOnObjectCreation" })
  if (sett.length > 0) {
    if (sett[0].value === "true") {
      return true
    } else {
      return false
    }
  }
}

// method to check if we have to send a object delete notification
export async function sendNotifOnObjectDeletion() {
  var sett = await Setting.find({ scope: "notif", name: "sendNotifOnObjectDeletion" })
  if (sett.length > 0) {
    if (sett[0].value === "true") {
      return true
    } else {
      return false
    }
  }
}

// method to check if we have to send a user creation welcome notification
export async function sendWelcomeMailOnUserCreation() {
  var sett = await Setting.find({ scope: "notif", name: "sendWelcomeMailOnUserCreation" })
  if (sett.length > 0) {
    if (sett[0].value === "true") {
      return true
    } else {
      return false
    }
  }
}

export async function sendConfirmMail(User) {
  var notifSender = await Setting.find({ scope: "mail", name: "smtpSenderAddres" })
  const ms_transporter = await createTransporter()
  const ms_mailOptions = {
    from: notifSender[0].value, // sender address
    template: "confirmEmail", // the name of the template file, i.e., email.handlebars
    to: User.email,
    subject: `Please verify your email address...`,
    context: {
      confirmUrl:
        enviromentConfig.app.confirmUrl +
        "?email=" +
        User.email +
        "&token=" +
        User.emailVerifyToken +
        "&_id=" +
        User._id,
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
  }

  try {
    await ms_transporter.sendMail(ms_mailOptions)
    logger.info(
      "MAIL | Successfully sent Confirm mail. | To: " +
        ms_mailOptions.to +
        " | From: " +
        ms_mailOptions.from +
        " | Subject: " +
        ms_mailOptions.subject
    )
  } catch (error) {
    logger.error("MAIL | Error sending Confirm mail to " + User.email + ": " + error.message)
    throw error // Re-throw the error to propagate it further if needed
  }
}

export async function sendPwResetMail(user, token) {
  var notifSender = await Setting.find({ scope: "mail", name: "smtpSenderAddres" })
  const ms_transporter = await createTransporter()
  const ms_mailOptions = {
    from: notifSender[0].value, // sender address
    template: "resetPw1", // the name of the template file, i.e., email.handlebars
    to: user.email,
    subject: `Please complete your password reset...`,
    context: {
      confirmUrl:
        enviromentConfig.app.confirmUrl + "/ForgotPw2?email=" + user.email + "&token=" + token,
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
  }

  try {
    await ms_transporter.sendMail(ms_mailOptions)
    logger.info(
      "MAIL | Successfully send password reset mail. | To: " +
        ms_mailOptions.to +
        " | From: " +
        ms_mailOptions.from +
        " | Subject: " +
        ms_mailOptions.subject
    )
  } catch (error) {
    logger.error("MAIL | Error sending password reset mail to " + User.email + ": " + error.message)
    //throw error; // Re-throw the error to propagate it further if needed
  }
}

export async function sendWelcomeMail(user) {
  var notifSender = await Setting.find({ scope: "mail", name: "smtpSenderAddres" })
  const ms_transporter = await createTransporter()
  const ms_mailOptions = {
    from: notifSender[0].value, // sender address
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
  }

  try {
    await ms_transporter.sendMail(ms_mailOptions)
    logger.info(
      "MAIL | Successfully send welcome mail. | To: " +
        ms_mailOptions.to +
        " | From: " +
        ms_mailOptions.from +
        " | Subject: " +
        ms_mailOptions.subject
    )
  } catch (error) {
    logger.error("MAIL | Error sending welcome mail to " + User.email + ": " + error.message)
    //throw error; // Re-throw the error to propagate it further if needed
  }
}

export async function sendObjectMail(objectName, objectType, action) {
  var notifReceiver = await Setting.find({ scope: "notif", name: "notifReceiver" })
  var notifReciverFirstname = await Setting.find({ scope: "notif", name: "notifReciverFirstname" })
  var notifReceiverLastname = await Setting.find({ scope: "notif", name: "notifReceiverLastname" })
  var notifSender = await Setting.find({ scope: "mail", name: "smtpSenderAddress" })
  const ms_transporter = await createTransporter()
  console.log(notifSender[0].value)
  const ms_mailOptions = {
    from: notifSender[0].value, // sender address
    template: "object", // the name of the template file, i.e., email.handlebars
    to: notifReceiver[0].value,
    subject: "An object has been " + action + " ...",
    context: {
      appName: enviromentConfig.app.appName,
      companyName: enviromentConfig.app.companyName,
      companyStreet: enviromentConfig.app.companyStreet,
      companyTown: enviromentConfig.app.companyTown,
      privacyPolicyUrl: enviromentConfig.app.privacyPolicyUrl,
      objectName: objectName,
      objectType: objectType,
      action: action,
      firstName: notifReciverFirstname[0].value,
      lastName: notifReceiverLastname[0].value,
    },
    attachments: [
      {
        filename: "email_blue.png",
        path: "mailImages/email_blue.png",
        cid: "logo",
      },
    ],
  }

  try {
    await ms_transporter.sendMail(ms_mailOptions)
    logger.info(
      "MAIL | Successfully send object " +
        action +
        " mail. | To: " +
        ms_mailOptions.to +
        " | From: " +
        ms_mailOptions.from +
        " | Subject: " +
        ms_mailOptions.subject
    )
  } catch (error) {
    logger.error(
      "MAIL | Error sending object " +
        action +
        " mail to " +
        notifReceiver[0].value +
        ": " +
        error.message
    )
    //throw error; // Re-throw the error to propagate it further if needed
  }
}
