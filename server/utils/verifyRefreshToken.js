import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";
import { enviromentConfig } from "../config/enviromentConfig.js";

const verifyRefreshToken = (refreshToken) => {
  const privateKey = enviromentConfig.jwt.refreshTokenPrivateKey;

  return new Promise((resolve, reject) => {
    UserToken.findOne({ token: refreshToken }, (err, doc) => {
      if (!doc) return reject({ error: true, message: "Invalid refresh token" });

      jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
        if (err) return reject({ error: true, message: "Invalid refresh token" });
        resolve({
          tokenDetails,
          error: false,
          message: "Valid refresh token",
        });
      });
    });
  });
};

export default verifyRefreshToken;
