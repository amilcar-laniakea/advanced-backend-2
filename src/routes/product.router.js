import express from "express";
import ProductActions from "../controllers/product.controller.js";

const router = express.Router();
const Product = new ProductActions();

router.get("/", async (req, res) => Product.getProducts(req, res));
router.get("/:id", (req, res) =>
  Product.getProductById(res, String(req.params.id))
);
router.post("/", (req, res) => Product.createProduct(res, req.body));
router.put("/:id", async (req, res) =>
  Product.updateProduct(res, req.params.id, req.body)
);
router.delete("/:id", async (req, res) =>
  Product.deleteProduct(res, req.params.id)
);

export default router;
