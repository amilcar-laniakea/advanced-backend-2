import { getUser, createUser } from "../services/user.service.js";
import {
  userErrorCodes,
  userSuccessCodes,
} from "../constants/user.constants.js";
import { createHash } from "../utils/create-hash.js";
import { Response } from "../utils/response.js";
import { generateJwt } from "../utils/generate-jwt.js";
import { isValidPassword } from "../utils/is-valid-password.js";

class UserController {
  constructor() {
    this.users = [];
  }

  async registerUser(req, res) {
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

      const user = await getUser(email, true);

      if (user) {
        return Response(
          res,
          null,
          userErrorCodes.ERROR_USER_EXISTS,
          400,
          false
        );
      }

      const hashedPassword = createHash(password);

      const userData = {
        first_name,
        last_name,
        email,
        age,
        role: typeof role === "string" ? role.toLowerCase() : undefined,
        cart_id,
      };

      const newUser = await createUser({
        ...userData,
        password: hashedPassword,
      });

      if (!newUser) {
        return Response(
          res,
          null,
          userErrorCodes.ERROR_CREATE_USER,
          400,
          false
        );
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
  }

  async loginUser(req, res) {
    try {
      const { cookie_auth } = req.headers;
      const { email, password, first_name, last_name, age, cart_id, role } =
        req.body;

      if (!email || !password) {
        return Response(
          res,
          null,
          userErrorCodes.ERROR_LOGIN_FIELDS_REQUIRED,
          400,
          false
        );
      }

      const user = await getUser(email);
      if (!user || !isValidPassword(password, user.password)) {
        return Response(
          res,
          null,
          userErrorCodes.ERROR_CREDENTIALS,
          400,
          false
        );
      }

      const userData = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart_id: user.cart_id,
      };

      const token = generateJwt(userData);

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
  }

  async currentUser(req, res) {
    try {
      const { user } = req;
      return Response(res, user);
    } catch (error) {
      return Response(res, null, error.message, 500, false);
    }
  }
}

export default UserController;
