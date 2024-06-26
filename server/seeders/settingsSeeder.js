import Setting from "../models/Setting.js";
import logger from "../services/logger.service.js";

const settingsToSeed = [
    { name: "showRegisterLink", value: true, scope: "app" },
    { name: "showResetPasswordLink", value: true, scope: "app" },
    { name: "showMfaEnableBanner", value: true, scope: "app" },
    { name: "showQuoteOfTheDay", value: true, scope: "app" },
    { name: "smtpServer", value: "your.mailserver.com", scope: "mail" },
    { name: "smtpPort", value: 25, scope: "mail" },
    { name: "smtpUsername", value: "YourUsername", scope: "mail" },
    { name: "smtpPassword", value: "YourPassword", scope: "mail" },
    { name: "smtpSenderAddress", value: "your@address.com", scope: "mail" },
    { name: "smtpTls", value: true, scope: "mail" },
    { name: "ldapBaseDn", value: "DC=YOUR,DC=Domain,DC=com", scope: "ldap" },
    {
        name: "ldapDomainController",
        value: "your.domaincontroller.com",
        scope: "ldap"
    },
    { name: "ldapDomainName", value: "your_domainname", scope: "ldap" },
    { name: "ldapEnabled", value: false, scope: "ldap" },
    { name: "ldapGroup", value: "Your_AD_Groupname", scope: "ldap" },
    { name: "sendNotifOnObjectCreation", value: false, scope: "notif" },
    { name: "sendNotifOnObjectDeletion", value: false, scope: "notif" },
    { name: "sendNotifOnObjectUpdate", value: false, scope: "notif" },
    { name: "sendNotifOnUserSelfRegister", value: false, scope: "notif" },
    { name: "sendWelcomeMailOnUserCreation", value: false, scope: "notif" },
    { name: "notifReceiver", value: "your@Mail.address", scope: "notif" },
    { name: "notifReciverFirstname", value: "Firstname", scope: "notif" },
    { name: "notifReceiverLastname", value: "Lastname", scope: "notif" }
];

const SeedSettings = async () => {
    for (const settingData of settingsToSeed) {
        const foundSetting = await Setting.findOne({ name: settingData.name });

        if (!foundSetting) {
            logger.info(`SEEDER | try to seed Setting ${settingData.name}..`);
            const newSetting = new Setting({
                scope: settingData.scope,
                name: settingData.name,
                value: settingData.value
            });

            await newSetting.save();
            logger.info(
                `SEEDER | Setting ${settingData.name} seeded successfully!`
            );
        }
    }
};

export default SeedSettings;
