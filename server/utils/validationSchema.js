import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const patchUserEmailValidation = (body) => {
  const schema = Joi.object({
    _id: Joi.string().required().label("UserId"),
    email: Joi.string().email().required().label("Email"),
  });
  return schema.validate(body);
};

const changePasswordValidation = (body) => {
  const schema = Joi.object({
    _id: Joi.string().required().label("UserId"),
    oldPassword: Joi.string().required().label("Old Password"),
    newPassword: Joi.string().required().label("New Password"),
  });
  return schema.validate(body);
};

const updateUserValidation = (body) => {
  const schema = Joi.object({
    _id: Joi.string().required().label("UserId"),
    firstName: Joi.string().required().label("Firstname"),
    lastName: Joi.string().required().label("Lastname"),
    userName: Joi.string().required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    roles: Joi.array().required().label("Roles"),
    mfaEnforced: Joi.boolean().label("2fa Enforced"),
    ldapEnabled: Joi.boolean().label("LDAP Enabled"),
    mfaEnabled: Joi.boolean().label("2fa Activated"),
    password: Joi.string().label("Password").allow("", null),
    emailVerifyToken: Joi.string().label("Email Verify token").allow("", null),
    pwResetToken: Joi.string().label("Password reset token").allow("", null),
    mfaToken: Joi.string().label("MFA token").allow("", null),
    mfaVerified: Joi.boolean().label("MFA verified").allow("", null),
    emailVerified: Joi.boolean().label("email verified"),
    accountLocked: Joi.boolean().label("account locked"),
    __v: Joi.number(),
    _id: Joi.string().allow("", null),
  });
  return schema.validate(body);
};

const updateRoleValidation = (body) => {
  const schema = Joi.object({
    _id: Joi.string().required().label("RoleId"),
    roleName: Joi.string().required().label("Rolename"),
    oldRoleName: Joi.string().required().label("Old Rolename"),
  });
  return schema.validate(body);
};

const updateAppSettingsValidation = (body) => {
  const schema = Joi.object({
    showMfaEnableBanner: Joi.string().required().label("Show mfa enable Banner"),
    showRegisterLink: Joi.string().required().label("Show register link"),
    showResetPasswordLink: Joi.string().required().label("Show reset password link"),
    showQuoteOfTheDay: Joi.string().required().label("Show quote of the day"),
  });
  return schema.validate(body);
};

const updateMailSettingsValidation = (body) => {
  const schema = Joi.object({
    smtpServer: Joi.string().required().label("smtp server"),
    smtpPort: Joi.number().required().label("smtp port"),
    smtpUsername: Joi.string().required().label("smtp username"),
    smtpPassword: Joi.string().required().label("smtp password"),
    smtpTls: Joi.boolean().required().label("enable tls"),
  });
  return schema.validate(body);
};

const updateLdapSettingsValidation = (body) => {
  const schema = Joi.object({
    ldapBaseDn: Joi.string().required().label("Base DN"),
    ldapDomainController: Joi.string().required().label("Domain Controller"),
    ldapDomainName: Joi.string().required().label("Domain name"),
    ldapGroup: Joi.string().required().label("Ldap Group name"),
    ldapEnabled: Joi.boolean().required().label("enable Ldap"),
  });
  return schema.validate(body);
};

const updateNotifSettingsValidation = (body) => {
  const schema = Joi.object({
    sendNotifOnObjectCreation: Joi.boolean().required().label("sendNotifOnObjectCreation"),
    sendNotifOnObjectDeletion: Joi.boolean().required().label("sendNotifOnObjectDeletion"),
    sendNotifOnObjectUpdate: Joi.boolean().required().label("sendNotifOnObjectUpdate"),
    sendNotifOnUserSelfRegister: Joi.boolean().required().label("sendNotifOnUserSelfRegister"),
    sendWelcomeMailOnUserCreation: Joi.boolean().required().label("sendWelcomeMailOnUserCreation"),
  });
  return schema.validate(body);
};

const createRoleValidation = (body) => {
  const schema = Joi.object({
    roleName: Joi.string().required().label("Rolename"),
  });
  return schema.validate(body);
};

const forgotpw2Validation = (body) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email adress"),
    token: Joi.string().required().label("Reset token"),
    password: Joi.string().required().label("New password"),
  });
  return schema.validate(body);
};

const createUserValidation = (body) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("Firstname"),
    lastName: Joi.string().required().label("Lastname"),
    userName: Joi.string().required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    roles: Joi.array().required().label("Roles"),
    emailVerifyToken: Joi.string().label("Email Verify token").allow("", null),
    pwResetToken: Joi.string().label("Password reset token").allow("", null),
    emailVerified: Joi.boolean().label("email verified").allow("", null),
    accountLocked: Joi.boolean().label("account locked").allow("", null),
    mfaEnforced: Joi.boolean().label("2fa Enforced").allow("", null),
    ldapEnabled: Joi.boolean().label("LDAP Enabled").allow("", null),
    mfaEnabled: Joi.boolean().label("2fa Activated").allow("", null),
  });
  return schema.validate(body);
};

const deleteUserValidation = (body) => {
  const schema = Joi.object({
    _id: Joi.string().required().label("UserId"),
  });
  return schema.validate(body);
};

const disableMfaValidation = (body) => {
  const schema = Joi.object({
    _id: Joi.string().required().label("UserId"),
    execUserId: Joi.string().required().label("The User id of the executing user"),
  });
  return schema.validate(body);
};

const unenforceMfaValidation = (body) => {
  const schema = Joi.object({
    _id: Joi.string().required().label("UserId"),
  });
  return schema.validate(body);
};

const deleteRoleValidation = (body) => {
  const schema = Joi.object({
    _id: Joi.string().required().label("RoleId"),
  });
  return schema.validate(body);
};

const confirmEmailValidation = (body) => {
  const schema = Joi.object({
    _id: Joi.string().required().label("Userid"),
    token: Joi.string().required().label("Confirmation token"),
    email: Joi.string().email().required().label("Email"),
  });
  return schema.validate(body);
};

const signUpBodyValidation = (body) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("Firstname"),
    lastName: Joi.string().required().label("Lastname"),
    userName: Joi.string().required().label("User Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(body);
};

const logInBodyValidation = (body) => {
  const schema = Joi.object({
    userName: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
  });
  return schema.validate(body);
};

export {
  updateRoleValidation,
  createRoleValidation,
  deleteRoleValidation,
  signUpBodyValidation,
  logInBodyValidation,
  refreshTokenBodyValidation,
  createUserValidation,
  deleteUserValidation,
  updateUserValidation,
  patchUserEmailValidation,
  confirmEmailValidation,
  changePasswordValidation,
  updateAppSettingsValidation,
  forgotpw2Validation,
  unenforceMfaValidation,
  disableMfaValidation,
  updateMailSettingsValidation,
  updateLdapSettingsValidation,
  updateNotifSettingsValidation
};
