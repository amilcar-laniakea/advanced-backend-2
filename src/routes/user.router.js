import { Router } from "express";
import { authenticateJwt } from "../utils/middlewares/authenticate-jwt.middleware.js";
import { authenticateRole } from "../utils/middlewares/authenticate-role.middleware.js";
import { registerUser, loginUser, currentUser } from "../controllers/user.controller.js";

const router = Router();


router.post(
  "/register", 
  registerUser
);
router.post(
  "/login", 
  loginUser
);
router.get(
  "/current",
  authenticateJwt(),
  authenticateRole("user"),
  currentUser
);

export default router;
