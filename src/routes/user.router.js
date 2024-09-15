import { Router } from "express";
import { authenticateJwt } from "../utils/middlewares/authenticate-jwt.middleware.js";
import { authenticateRole } from "../utils/middlewares/authenticate-role.middleware.js";
import UserActions from "../controllers/user.controller.js";

const router = Router();
const User = new UserActions();

router.post("/register", User.registerUser);
router.post("/login", User.loginUser);
router.get(
  "/current",
  authenticateJwt(),
  authenticateRole("user"),
  User.currentUser
);

export default router;
