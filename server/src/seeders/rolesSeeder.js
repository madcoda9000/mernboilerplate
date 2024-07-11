import Role from "../models/Roles.js";
import logger from "../services/logger.service.js";

/**
 * @summary method to seed initial roles
 */
const SeedRoles = async () => {
    // check if role was seeded already, else seed roles
    const foundUserRole = await Role.findOne({ roleName: "users" });
    const foundAdminRole = await Role.findOne({ roleName: "admins" });

    if (!foundUserRole) {
        logger.info("SEEDER | try to seed user role role");
        // create array of roles
        const Roles = [
            new Role({
                roleName: "users"
            })
        ];

        Roles.map(async (p, index) => {
            await p.save((err, result) => {
                if (index === Roles.length - 1) {
                    logger.info("SEEDER | users role seeded successfully!");
                }
            });
        });
    }

    if (!foundAdminRole) {
        logger.info("SEEDER | try to seed admins role");
        // create array of roles
        const Roles = [
            new Role({
                roleName: "admins"
            })
        ];

        Roles.map(async (p, index) => {
            await p.save((err, result) => {
                if (index === Roles.length - 1) {
                    logger.info("SEEDER | admins role seeded successfully!");
                }
            });
        });
    }
};

export default SeedRoles;
