/**
 * @description Middleware function to check user roles.
 * @param {string | string[]} roles - A single role or an array of roles to check against the user's roles.
 * @returns {Function} Express middleware function.
 */
const roleCheck = (roles) => {
  return (req, res, next) => {
    const userRoles = req.user && req.user.roles

    if (!userRoles) {
      return res.status(403).json({ error: true, message: "User roles not found." })
    }

    const rolesToCheck = Array.isArray(roles) ? roles : [roles]

    if (rolesToCheck.some((role) => userRoles.includes(role))) {
      return next()
    } else {
      return res.status(403).json({ error: true, message: "You are not authorized." })
    }
  }
}

export default roleCheck
