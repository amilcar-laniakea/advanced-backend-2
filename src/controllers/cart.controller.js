import {
  getAllCarts,
  getCartById,
  createCart,
  deleteCart,
} from "../services/cart.service.js";
import { getProductById } from "../services/product.service.js";
import { Response } from "../utils/response.js";
import {
  cartSuccessCodes,
  cartErrorCodes,
} from "../constants/cart.constants.js";
import { productErrorCodes } from "../constants/product.constants.js";
import { isValidObjectId } from "../utils/is-valid-object-id.js";

class CartController {
  constructor() {
    this.cart = [];
    this.product = [];
  }
  async getCarts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;

      this.cart = await getAllCarts(page, limit);

      return Response(res, this.cart, cartSuccessCodes.SUCCESS_GET);
    } catch (error) {
      return Response(res, null, error.message, 500, false);
    }
  }

  async getCartById(res, id) {
    try {
      this.cart = await getCartById(id, true);

      return Response(res, this.cart);
    } catch (error) {
      if (error.message === cartErrorCodes.INVALID_FORMAT) {
        return Response(res, null, error.message, 400, false);
      }

      if (error.message === cartErrorCodes.NOT_FOUND) {
        return Response(res, null, error.message, 404, false);
      }

      return Response(res, null, error.message, 500, false);
    }
  }

  async createCart(res) {
    try {
      this.cart = await createCart();

      return Response(res, this.cart, cartSuccessCodes.SUCCESS_CREATE);
    } catch (error) {
      return Response(res, null, error.message, 500, false);
    }
  }

  async deleteCart(res, id) {
    try {
      this.cart = await deleteCart(id);

      return Response(res, this.cart, cartSuccessCodes.SUCCESS_DELETE);
    } catch (error) {
      if (error.message === cartErrorCodes.INVALID_FORMAT) {
        return Response(res, null, error.message, 400, false);
      }

      if (error.message === cartErrorCodes.NOT_FOUND) {
        return Response(res, null, error.message, 404, false);
      }

      return Response(res, null, error.message, 500, false);
    }
  }

  async addCartProduct(res, cid, pid, quantity = 1, isReduceQuantity = false) {
    try {
      if (!isValidObjectId(pid)) {
        return Response(
          res,
          null,
          productErrorCodes.INVALID_FORMAT,
          400,
          false
        );
      }

      const cart = await getCartById(cid);
      const product = await getProductById(pid);

      if (product.stock < quantity) {
        return Response(res, null, productErrorCodes.NOT_STOCK, 400, false);
      }

      const productIndex = cart.products.findIndex(
        (prod) => prod.product.toString() === pid
      );

      if (productIndex !== -1) {
        if (isReduceQuantity) {
          if (cart.products[productIndex].quantity <= quantity) {
            return Response(
              res,
              null,
              cartErrorCodes.NOT_ENOUGH_STOCK,
              400,
              false
            );
          }
          cart.products[productIndex].quantity -= quantity;
        } else {
          cart.products[productIndex].quantity += quantity;
        }
      }

      if (productIndex === -1) {
        if (!isReduceQuantity) {
          cart.products.push({ product: pid, quantity });
        } else {
          return Response(
            res,
            null,
            cartErrorCodes.NOT_FOUND_PRODUCT,
            404,
            false
          );
        }
      }

      await cart.save();

      const productResponse = {
        ...product._doc,
        quantity:
          productIndex !== -1 ? cart.products[productIndex].quantity : quantity,
      };

      return Response(
        res,
        productResponse,
        cartSuccessCodes.SUCCESS_ADD_PRODUCT
      );
    } catch (error) {
      if (error.message === cartErrorCodes.INVALID_FORMAT) {
        return Response(res, null, error.message, 400, false);
      }

      if (error.message === cartErrorCodes.NOT_FOUND) {
        return Response(res, null, error.message, 404, false);
      }

      if (error.message === productErrorCodes.INVALID_FORMAT) {
        return Response(res, null, error.message, 400, false);
      }

      if (error.message === productErrorCodes.NOT_FOUND) {
        return Response(res, null, error.message, 404, false);
      }

      return Response(res, null, error.message, 500, false);
    }
  }

  async deleteCartProduct(res, cid, pid) {
    try {
      if (!isValidObjectId(pid)) {
        return Response(
          res,
          null,
          productErrorCodes.INVALID_FORMAT,
          400,
          false
        );
      }

      const cart = await getCartById(cid);

      const productIndex = cart.products.findIndex(
        (prod) => prod.product.toString() === pid
      );

      if (productIndex === -1) {
        return Response(
          res,
          null,
          cartErrorCodes.NOT_FOUND_PRODUCT,
          404,
          false
        );
      }

      cart.products.splice(productIndex, 1);

      await cart.save();

      return Response(res, cart, cartSuccessCodes.SUCCESS_DELETE_PRODUCT);
    } catch (error) {
      if (error.message === cartErrorCodes.INVALID_FORMAT) {
        return Response(res, null, error.message, 400, false);
      }

      if (error.message === cartErrorCodes.NOT_FOUND) {
        return Response(res, null, error.message, 404, false);
      }

      if (error.message === productErrorCodes.INVALID_FORMAT) {
        return Response(res, null, error.message, 400, false);
      }

      if (error.message === productErrorCodes.NOT_FOUND) {
        return Response(res, null, error.message, 404, false);
      }

      return Response(res, null, error.message, 500, false);
    }
  }
}

export default CartController;
