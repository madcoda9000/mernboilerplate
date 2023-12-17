import Setting from "../models/Setting.js";
import logger from "../services/logger.service.js";

/**
 * @summary method to seed initial roles
 */
const SeedSettings = async () => {
  logger.info("SEEDER | try to seed intial settings");

  // check if settings was seeded already, else seed roles
  const foundShowRegister = await Setting.findOne({ name: "showRegisterLink" });
  const foundShowResetPassword = await Setting.findOne({ name: "showResetPasswordLink" });
  const foundMfaEnableBanner = await Setting.findOne({ name: "showMfaEnableBanner" });
  const foundShowQuoteOfTheDay = await Setting.findOne({ name: "showQuoteOfTheDay" });

  if (!foundShowRegister) {
    // create array of roles
    const sett = [
      new Setting({
        scope: "app",
        name: "showRegisterLink",
        value: true,
      }),
    ];

    sett.map(async (p, index) => {
      await p.save((err, result) => {
        if (index === sett.length - 1) {
          logger.info("SEEDER | showRegisterLink seeded successfully!");
        }
      });
    });
  } else {
    logger.info("SEEDER | setting showRegisterLink exists already!");
  }

  if (!foundShowResetPassword) {
    // create array of roles
    const sett = [
      new Setting({
        scope: "app",
        name: "showResetPasswordLink",
        value: true,
      }),
    ];

    sett.map(async (p, index) => {
      await p.save((err, result) => {
        if (index === sett.length - 1) {
          logger.info("SEEDER | showResetPasswordLink seeded successfully!");
        }
      });
    });
  } else {
    logger.info("SEEDER | setting showResetPasswordLink exists already!");
  }

  if (!foundMfaEnableBanner) {
    // create array of roles
    const sett = [
      new Setting({
        scope: "app",
        name: "showMfaEnableBanner",
        value: true,
      }),
    ];

    sett.map(async (p, index) => {
      await p.save((err, result) => {
        if (index === sett.length - 1) {
          logger.info("SEEDER | showMfaEnableBanner seeded successfully!");
        }
      });
    });
  } else {
    logger.info("SEEDER | setting showMfaEnableBanner exists already!");
  }

  if (!foundShowQuoteOfTheDay) {
    // create array of roles
    const sett = [
      new Setting({
        scope: "app",
        name: "showQuoteOfTheDay",
        value: true,
      }),
    ];

    sett.map(async (p, index) => {
      await p.save((err, result) => {
        if (index === sett.length - 1) {
          logger.info("SEEDER | showQuoteOfTheDay seeded successfully!");
        }
      });
    });
  } else {
    logger.info("SEEDER | setting showQuoteOfTheDay exists already!");
  }
};

export default SeedSettings;
