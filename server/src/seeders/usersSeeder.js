import User from "../models/User.js";
import bcrypt from "bcrypt";
import logger from "../services/logger.service.js";

/**
 * @summary method to seed initial users
 */
const SeedUsers = async () => {
    // check if user was seeded already, else seed user
    const foundUser = await User.findOne({ userName: "super.admin" });

    if (!foundUser) {
        logger.info("SEEDER | try to seed intial admin user");
        // create array of users
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash("Test1000!", salt);
        const Users = [
            new User({
                firstName: "Super",
                lastName: "Admin",
                userName: "super.admin",
                email: "super.admin@local.app",
                password: hashPassword,
                roles: ["admins"],
                mfaEnforced: false,
                mfaEnabled: false,
                emailVerified: true,
                accountLocked: false,
                ldapEnabled: false
            })
        ];

        Users.map(async (p, index) => {
            await p.save((err, result) => {
                if (index === Users.length - 1) {
                    logger.info("SEEDER | users seeded successfully!");
                }
            });
        });
    }
};

export default SeedUsers;
