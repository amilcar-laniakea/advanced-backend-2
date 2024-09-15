import express from "express";
import CartActions from "../controllers/cart.controller.js";

const router = express.Router();
const Cart = new CartActions();

router.get("/", async (req, res) => Cart.getCarts(req, res));
router.get("/:id", async (req, res) => Cart.getCartById(res, req.params.id));
router.post("/", (_, res) => Cart.createCart(res));
router.post("/:cid/product/:pid", async (req, res) =>
  Cart.addCartProduct(
    res,
    req.params.cid,
    req.params.pid,
    req.body?.quantity,
    req.body.isReduceQuantity
  )
);
router.delete("/:cid/product/:pid", async (req, res) =>
  Cart.deleteCartProduct(res, req.params.cid, req.params.pid)
);
router.delete("/:id", (req, res) => Cart.deleteCart(res, req.params.id));

export default router;
