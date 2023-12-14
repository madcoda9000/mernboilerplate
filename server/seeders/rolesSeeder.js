import Role from "../models/Roles.js";
import logger from "../services/logger.service.js";

/**
 * @summary method to seed initial roles
 */
const SeedRoles = async () => {

  logger.info("SEEDER | try to seed intial roles");

  // check if role was seeded already, else seed roles
  const foundUserRole = await Role.findOne({ roleName: "users" });
  const foundAdminRole = await Role.findOne({ roleName: "admins" });

  if (!foundUserRole) {
    // create array of roles
    const Roles = [
      new Role({
        roleName: "users"
      }),
    ]

    Roles.map( async (p, index) => {
      await p.save((err, result) => {
        if (index === Roles.length - 1) {
          logger.info("SEEDER | users role seeded successfully!");
        }
      });
    });
  } else {
    logger.info("SEEDER | users role seeded already.");
  }

  if (!foundAdminRole) {
    // create array of roles
    const Roles = [
      new Role({
        roleName: "admins"
      }),
      new Role({
        roleName: "it-operations"
      }),
      new Role({
        roleName: "it-sd"
      }),
      new Role({
        roleName: "dwh"
      }),
      new Role({
        roleName: "MDM"
      }),
    ]

    Roles.map(async (p, index) => {
      await p.save((err, result) => {
        if (index === Roles.length - 1) {
          logger.info("SEEDER | admins role seeded successfully!");
        }
      });
    });
  } else {
    logger.info("SEEDER | admins role seeded already.");
  }
  
}

export default SeedRoles;