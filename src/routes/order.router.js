import { Router } from "express";
import { authenticateJwt } from "../utils/middlewares/authenticate-jwt.middleware.js";
import { authenticateRole } from "../utils/middlewares/authenticate-role.middleware.js";
import { getOrders, getOrder } from "../controllers/order.controller.js";

const router = Router();

router.get(
  "/",
  authenticateJwt(),
  authenticateRole("admin"),
  getOrders
);
router.get(
  "/:id",
  authenticateJwt(),
  authenticateRole("user"),
  getOrder
);

export default router;
