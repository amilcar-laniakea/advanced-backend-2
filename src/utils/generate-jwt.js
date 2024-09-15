import jwt from "jsonwebtoken";
import { appSecret, jwtExpirationTime } from "../config/env.js";

export const generateJwt = (data) => {
  return jwt.sign(data, appSecret, {
    expiresIn: jwtExpirationTime,
  });
};
