import { Router } from "express";
import { authenticateJwt } from "../utils/middlewares/authenticate-jwt.middleware.js";
import { authenticateRole } from "../utils/middlewares/authenticate-role.middleware.js";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get(
  "/", 
  getProducts
);
router.get(
  "/:id", 
  getProduct
);
router.post(
  "/", 
  authenticateJwt(), 
  authenticateRole("admin"), 
  createProduct
);
router.patch(
  "/:id",
  authenticateJwt(),
  authenticateRole("admin"),
  updateProduct
);
router.delete(
  "/:id",
  authenticateJwt(),
  authenticateRole("admin"),
  deleteProduct
);

export default router;
