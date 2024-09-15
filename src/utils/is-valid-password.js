import bcrypt from "bcryptjs";

export const isValidPassword = (requestPassword, storedPassword) =>
  bcrypt.compareSync(requestPassword, storedPassword);
