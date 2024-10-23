import { isValidEmail } from "../../utils/is-valid-email.js";
import { userErrorCodes } from "../../constants/user.constants.js";
import userModel from "../models/user.model.js";

export default class User {
  getUser = async (data, bypassError = false) => {
    if (!isValidEmail(data))
      throw new Error(userErrorCodes.ERROR_INVALID_EMAIL_FORMAT);

    const user = await userModel.findOne({ email: data }).populate({
      path: "cart_id",
      populate: {
        path: "products.product",
        model: "Product",
      },
    });

    if (!user && !bypassError) throw new Error(userErrorCodes.ERROR_NOT_FOUND);

    return user;
  };

  createUser = async (data) => {
    if (!isValidEmail(data.email))
      throw new Error(userErrorCodes.ERROR_INVALID_EMAIL_FORMAT);

    const userRequest = new userModel(data);
    const user = await userRequest.save();

    if (!user) {
      throw new Error(userErrorCodes.ERROR_UNEXPECTED);
    }

    return user;
  };
}
