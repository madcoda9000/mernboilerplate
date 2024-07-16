import UserToken from "../models/UserToken.js"
import jwt from "jsonwebtoken"
import { enviromentConfig } from "../config/enviromentConfig.js"

const verifyRefreshToken = async (refreshToken) => {
  const privateKey = enviromentConfig.jwt.refreshTokenPrivateKey

  return new Promise(async (resolve, reject) => {
    const doc = await UserToken.findOne({ token: refreshToken })
    if (doc !== null) {
      jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
        if (err) return reject({ error: true, message: "Invalid refresh token" })
        resolve({
          tokenDetails,
          error: false,
          message: "Valid refresh token",
        })
      })
    } else {
      return reject({ error: true, message: "Invalid refresh token" })
    }
  })
}

export default verifyRefreshToken
