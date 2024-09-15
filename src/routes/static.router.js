import { Router } from "express";
import StaticActions from "../controllers/static.controller.js";

const router = Router();
const Render = new StaticActions();

router.get("/products", async (req, res) => Render.renderProducts(req, res));
router.get("/product-detail/:pid", async (req, res) =>
  Render.renderProductById(req, res)
);
router.get("/cart", async (req, res) => Render.renderCartById(req, res));

export default router;
