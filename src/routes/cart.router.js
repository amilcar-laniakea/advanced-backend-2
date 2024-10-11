import { Router } from "express";
import { authenticateJwt } from "../utils/middlewares/authenticate-jwt.middleware.js";
import { authenticateRole } from "../utils/middlewares/authenticate-role.middleware.js";
import {
  getCarts,
  getCart,
  createCart,
  addCartProduct,
  deleteCartProduct,
  deleteCart,
  purchaseCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.get(
  "/", 
  authenticateJwt(),
  authenticateRole("admin"),
  getCarts
);
router.get(
  "/:id", 
  authenticateJwt(),
  authenticateRole("admin"),
  getCart,

);
router.post(
  "/", 
  authenticateJwt(), 
  authenticateRole("user"),
  createCart
);
router.post(
  "/:cid/product/:pid",
  authenticateJwt(),
  authenticateRole("user"),
  addCartProduct
);
router.delete(
  "/:cid/product/:pid",
  authenticateJwt(),
  authenticateRole("user"),
  deleteCartProduct
);
router.delete(
  "/:id",
  authenticateJwt(), 
  authenticateRole("admin"),
  deleteCart
);
router.post(
  "/:id/purchase", 
  authenticateJwt(), 
  authenticateRole("user"), 
  purchaseCart);

export default router;
