import bcrypt from "bcryptjs";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
