import cartModel from "../models/cart.model.js";
import { isValidObjectId } from "../../utils/is-valid-object-id.js";
import { cartErrorCodes } from "../../constants/cart.constants.js";

export default class Cart {
  getCarts = async (page, limit) => {
    const carts = await cartModel.paginate(
      {},
      { page, limit, lean: true, populate: { path: "products.product" } }
    );

    if (carts.length === 0) throw new Error(cartErrorCodes.NOT_FOUND);

    return carts;
  };
  getCart = async (id, populate, bypassError) => {
    if (!isValidObjectId(id)) throw new Error(cartErrorCodes.INVALID_FORMAT);

    let cart;

    if (populate) {
      cart = await cartModel
        .findById(id)
        .populate({ path: "products.product" });
    } else {
      cart = await cartModel.findById(id);
    }

    if (!cart && !bypassError) throw new Error(cartErrorCodes.NOT_FOUND);

    return cart;
  };

  createCart = async (id) => {
    const cart = new cartModel({ user: id });
    const cartSaved = await cart.save();

    if (!cartSaved) throw new Error(cartErrorCodes.UNEXPECTED_ERROR);

    return cartSaved;
  };

  deleteCart = async (id) => {
    if (!isValidObjectId(id)) throw new Error(cartErrorCodes.INVALID_FORMAT);

    const cart = await cartModel.findByIdAndDelete(id);

    if (!cart) throw new Error(cartErrorCodes.NOT_FOUND);

    return cart;
  };
}
