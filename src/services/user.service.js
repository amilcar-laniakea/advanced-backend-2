import { isValidEmail } from "../utils/is-valid-email.js";
import { userErrorCodes } from "../constants/user.constants.js";
import User from "../models/user.model.js";

export const getUser = async (data, bypassError = false) => {
  if (!isValidEmail(data))
    throw new Error(userErrorCodes.ERROR_INVALID_EMAIL_FORMAT);

  const user = await User.findOne({ email: data }).populate({
    path: "cart_id",
    populate: {
      path: "products.product",
      model: "Product",
    },
  });

  if (!user && !bypassError) throw new Error(userErrorCodes.ERROR_NOT_FOUND);

  return user;
};

export const createUser = async (data) => {
  if (!isValidEmail(data.email))
    throw new Error(userErrorCodes.ERROR_INVALID_EMAIL_FORMAT);

  const userRequest = new User(data);
  const user = await userRequest.save();

  if (!user) {
    throw new Error(userErrorCodes.ERROR_UNEXPECTED);
  }

  return user;
};

export const serviceUpdateUser = async (id, data) => {
  const user = await Product.findByIdAndUpdate(id, data);

  if (!user) {
    throw new Error(userErrorCodes.NOT_FOUND);
  }

  return user;
};
