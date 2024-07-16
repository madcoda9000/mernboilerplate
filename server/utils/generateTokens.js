import jwt from "jsonwebtoken"
import UserToken from "../models/UserToken.js"
import { enviromentConfig } from "../config/enviromentConfig.js"

const generateTokens = async (user) => {
  try {
    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      roles: user.roles,
      mfaEnabled: user.mfaEnabled,
      mfaEnforced: user.mfaEnforced,
      mfaVerified: user.mfaVerified,
    }
    const accessToken = jwt.sign(payload, enviromentConfig.jwt.accessTokenPrivateKey, {
      expiresIn: "1m",
    })
    const refreshToken = jwt.sign(payload, enviromentConfig.jwt.refreshTokenPrivateKey, {
      expiresIn: "30d",
    })

    const userToken = await UserToken.findOne({ userId: user._id })
    if (userToken) await userToken.deleteOne()

    await new UserToken({ userId: user._id, token: refreshToken }).save()
    return Promise.resolve({ accessToken, refreshToken })
  } catch (err) {
    return Promise.reject(err)
  }
}

export default generateTokens
