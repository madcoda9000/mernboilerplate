import Setting from "../models/Setting.js";
import logger from "../services/logger.service.js";

const settingsToSeed = [
  { name: "showRegisterLink", value: true, scope: "app" },
  { name: "showResetPasswordLink", value: true, scope: "app" },
  { name: "showMfaEnableBanner", value: true, scope: "app" },
  { name: "showQuoteOfTheDay", value: true, scope: "app" },
];

const SeedSettings = async () => {
  logger.info("SEEDER | try to seed initial settings");

  for (const settingData of settingsToSeed) {
    const foundSetting = await Setting.findOne({ name: settingData.name });

    if (!foundSetting) {
      const newSetting = new Setting({
        scope: settingData.scope,
        name: settingData.name,
        value: settingData.value,
      });

      await newSetting.save();
      logger.info(`SEEDER | Setting ${settingData.name} seeded successfully!`);
    } else {
      logger.info(`SEEDER | Setting ${settingData.name} exists already!`);
    }
  }
};

export default SeedSettings;
