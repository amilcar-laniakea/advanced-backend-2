import passport from "passport";
import { Response } from "../response.js";
import { exceptionErrors } from "../../constants/general.constants.js";

export const authenticateJwt = (strategy = "jwt") => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (error, user, info) => {
      if (error) {
        return Response(res, null, error, 500, false);
      }
      if (!user) {
        const errorDescription =
          info?.message || exceptionErrors.ERROR_AUTH_FAILED;
        return Response(res, null, errorDescription, 401, false);
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};
