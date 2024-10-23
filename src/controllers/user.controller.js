import User from "../dao/classes/user.dao.js";
import {
  userErrorCodes,
  userSuccessCodes,
} from "../constants/user.constants.js";
import { createHash } from "../utils/create-hash.js";
import { Response } from "../utils/response.js";
import { generateJwt } from "../utils/generate-jwt.js";
import { isValidPassword } from "../utils/is-valid-password.js";
import UserDTO from "../dto/user.dto.js";

const userService = new User();

export const registerUser = async (req, res) => {
  try {
    const { cookie_auth } = req.headers;
    const { first_name, last_name, email, password, age, role, cart_id } =
      req.body;

    if (!email || !password || !first_name || !last_name || !age) {
      return Response(
        res,
        null,
        userErrorCodes.ERROR_REGISTER_FIELDS_REQUIRED,
        400,
        false
      );
    }

    if (password.length < 6) {
      return Response(
        res,
        null,
        userErrorCodes.ERROR_PASSWORD_LENGTH,
        400,
        false
      );
    }

    const user = await userService.getUser(email, true);

    if (user) {
      return Response(res, null, userErrorCodes.ERROR_USER_EXISTS, 400, false);
    }

    const hashedPassword = createHash(password);

    const userDataDTO = UserDTO.fromRequestBody(req.body);

    const newUser = await userService.createUser({
      ...userDataDTO,
      password: hashedPassword,
    });

    if (!newUser) {
      return Response(res, null, userErrorCodes.ERROR_CREATE_USER, 400, false);
    }

    const newUserData = {
      id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      age: newUser.age,
      role: newUser.role,
      cart_id: newUser.cart_id,
    };

    const token = generateJwt(newUserData);

    return Response(
      res,
      { token },
      userSuccessCodes.SUCCESS_REGISTER,
      201,
      true,
      cookie_auth ? "jwt_token" : null,
      cookie_auth ? token : null
    );
  } catch (error) {
    return Response(res, null, error.message, 500, false);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { cookie_auth } = req.headers;
    const { email, password } = req.body;

    if (!email || !password) {
      return Response(
        res,
        null,
        userErrorCodes.ERROR_LOGIN_FIELDS_REQUIRED,
        400,
        false
      );
    }

    const user = await userService.getUser(email);
    if (!user || !isValidPassword(password, user.password)) {
      return Response(res, null, userErrorCodes.ERROR_CREDENTIALS, 400, false);
    }

    const userDataDTO = UserDTO.fromMongoDocument(user);

    const token = generateJwt(userDataDTO.toObject());

    return Response(
      res,
      token,
      userSuccessCodes.SUCCESS_LOGIN,
      200,
      true,
      cookie_auth ? "jwt_token" : null,
      cookie_auth ? token : null
    );
  } catch (error) {
    if (error.message === userErrorCodes.ERROR_INVALID_EMAIL_FORMAT) {
      return Response(
        res,
        null,
        userErrorCodes.ERROR_INVALID_EMAIL_FORMAT,
        400,
        false
      );
    }
    return Response(res, null, error.message, 500, false);
  }
};

export const currentUser = async (req, res) => {
  try {
    const { user } = req;

    const userData = await userService.getUser(user.email);

    if (!userData) {
      return Response(res, null, userErrorCodes.ERROR_NOT_FOUND, 404, false);
    }

    if (user.role !== userData.role) {
      return Response(
        res,
        null,
        userErrorCodes.ERROR_INCONSISTENT_ROLE,
        401,
        false
      );
    }

    const userResponse = UserDTO.fromMongoDocument(userData);

    return Response(res, userResponse);
  } catch (error) {
    return Response(res, null, error.message, 500, false);
  }
};
