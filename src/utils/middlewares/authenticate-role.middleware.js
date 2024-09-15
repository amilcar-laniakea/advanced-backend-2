import { Response } from "../response.js";
import { exceptionErrors } from "../../constants/general.constants.js";

export const authenticateRole = (role) => {
  return async (req, res, next) => {
    console.log("req.user", req.user);
    console.log("role", role);
    if (!req.user)
      return Response(
        res,
        null,
        exceptionErrors.ERROR_UNAUTHORIZED,
        401,
        false
      );
    if (req.user.role !== role)
      return Response(
        res,
        null,
        exceptionErrors.ERROR_NO_PERMISSION,
        403,
        false
      );
    next();
  };
};
