import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { appSecret } from "./env.js";

const customExtractor = (req) => {
  if (req.headers["cookie_auth"]) {
    return req.cookies["jwt_token"];
  }
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

const options = {
  jwtFromRequest: customExtractor,
  secretOrKey: appSecret,
};
export const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload);
      } catch (error) {
        return done(error);
      }
    })
  );
};
