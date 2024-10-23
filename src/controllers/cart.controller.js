import Cart from "../dao/classes/cart.dao.js";
import Product from "../dao/classes/product.dao.js";
import User from "../dao/classes/user.dao.js";
import Order from "../dao/classes/order.dao.js";
import Email from "../dao/classes/email.dao.js";

import { Response } from "../utils/response.js";
import {
  cartSuccessCodes,
  cartErrorCodes,
} from "../constants/cart.constants.js";
import { productErrorCodes } from "../constants/product.constants.js";
import { isValidObjectId } from "../utils/is-valid-object-id.js";
import CartDTO from "../dto/cart.dto.js";

const cartService = new Cart();
const productService = new Product();
const userService = new User();
const orderService = new Order();
const emailService = new Email();

export const getCarts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const request = await cartService.getCarts(page, limit);
    const cartDTO = CartDTO.fromMongoDocumentList(request.docs);

    return Response(
      res,
      { ...request, docs: cartDTO },
      cartSuccessCodes.SUCCESS_GET
    );
  } catch (error) {
    return Response(res, null, error.message, 500, false);
  }
};

export const getCart = async (req, res) => {
  try {
    const response = await cartService.getCart(req.params.id, true);
    const cartDTO = CartDTO.fromMongoDocument(response);

    return Response(res, cartDTO);
  } catch (error) {
    if (error.message === cartErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);
    if (error.message === cartErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const createCart = async (req, res) => {
  try {
    const { user } = req;

    const userData = await userService.getUser(user.email);

    if (!userData)
      return Response(res, null, userErrorCodes.ERROR_NOT_FOUND, 404, false);

    let checkCart;

    if (userData?.cart_id?._id) {
      checkCart = await cartService.getCart(
        userData?.cart_id?._id,
        false,
        true
      );
    }

    if (checkCart && checkCart._id._id === userData?.cart_id?._id)
      return Response(res, null, cartErrorCodes.ERROR_DUPLICATE, 400, false);

    const response = await cartService.createCart(userData._id);

    userData.cart_id = response._id;

    await userData.save();
    const cartResponse = CartDTO.fromMongoDocument(response);

    return Response(res, cartResponse, cartSuccessCodes.SUCCESS_CREATE);
  } catch (error) {
    if (error.errorResponse?.code === 11000)
      return Response(res, null, error.message, 400, false);
    return Response(res, null, error.message, 500, false);
  }
};

export const deleteCart = async (req, res) => {
  try {
    const response = await cartService.deleteCart(req.params.id);

    return Response(res, response, cartSuccessCodes.SUCCESS_DELETE);
  } catch (error) {
    if (error.message === cartErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);

    if (error.message === cartErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const deleteCartProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    if (!isValidObjectId(pid))
      return Response(res, null, productErrorCodes.INVALID_FORMAT, 400, false);

    const cart = await cartService.getCart(cid);

    const productIndex = cart.products.findIndex(
      (prod) => prod.product.toString() === pid
    );

    if (productIndex === -1)
      return Response(res, null, cartErrorCodes.NOT_FOUND_PRODUCT, 404, false);

    cart.products.splice(productIndex, 1);

    await cart.save();

    return Response(res, cart, cartSuccessCodes.SUCCESS_DELETE_PRODUCT);
  } catch (error) {
    if (error.message === cartErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);

    if (error.message === cartErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    if (error.message === productErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);

    if (error.message === productErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const addCartProduct = async (req, res) => {
  try {
    const { id } = req.user;
    const { cid, pid } = req.params;
    const { quantity = 1, isReduceQuantity = false } = req.body;

    if (!isValidObjectId(pid))
      return Response(res, null, productErrorCodes.INVALID_FORMAT, 400, false);

    const cart = await cartService.getCart(cid);
    const product = await productService.getProduct(pid);

    if (id !== cart.user.toString())
      return Response(res, null, cartErrorCodes.ERROR_UNAUTHORIZED, 400, false);

    if (product.stock < quantity)
      return Response(res, null, productErrorCodes.NOT_STOCK, 400, false);

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

    return Response(res, productResponse, cartSuccessCodes.SUCCESS_ADD_PRODUCT);
  } catch (error) {
    if (error.message === cartErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);

    if (error.message === cartErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    if (error.message === productErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);

    if (error.message === productErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { id: idUser, email, first_name, last_name } = req.user;
    const { id: idCart } = req.params;

    const cart = await cartService.getCart(idCart);

    if (idUser !== cart.user.toString())
      return Response(res, null, cartErrorCodes.ERROR_UNAUTHORIZED, 400, false);

    const noStockProducts = [];

    const products = await Promise.all(
      cart.products.map(async (prod) => {
        const product = await productService.getProduct(prod.product);

        if (product.stock < prod.quantity) {
          noStockProducts.push(product);
          return;
        }

        product.stock -= prod.quantity;

        await product.save();

        return product;
      })
    );

    const filteredProducts = products.filter(
      (product) => product !== undefined
    );

    if (filteredProducts.length === 0)
      return Response(res, null, cartErrorCodes.ERROR_PURCHASE, 400, false);

    const productsProcessed = [...cart.products];

    const productsPurchased = productsProcessed.filter((prod) => {
      const existsInFiltered = filteredProducts.some(
        (filterProduct) => prod.product.toString() === filterProduct.id
      );

      return existsInFiltered;
    });

    cart.products = cart.products.filter((prod) => {
      const existsInFiltered = noStockProducts.some(
        (filterProduct) => prod.product.toString() === filterProduct.id
      );

      return existsInFiltered;
    });

    const totalOrders = await orderService.getOrders({ bypassError: true });

    const order = {
      code:
        totalOrders && typeof totalOrders.totalDocs === "number"
          ? totalOrders.totalDocs + 1
          : Math.floor(1000000000 + Math.random() * 9000000000),
      amount: filteredProducts.reduce((acc, product) => acc + product.price, 0),
      products: productsPurchased,
      user: idUser,
    };

    const response = await orderService.createOrder(order);

    await cart.save();

    const emailSendObject = {
      emailUser: email,
      userName: `${first_name} ${last_name}`,
      orderId: response.id,
      code: response.code,
      amount: response.amount,
      datePurchase: response.createdAt,
      products: filteredProducts,
    };

    const html = `
      <h1>Purchase Confirmation</h1>
      <p>Thank you for your purchase, ${emailSendObject.userName}!</p>
      <p>Your purchase has been confirmed with the following details:</p>
      <p><strong>Order ID:</strong> ${emailSendObject.code}</p>
      <p><strong>Date:</strong> ${emailSendObject.datePurchase}</p>
      <p>You have bought ${
        emailSendObject.products.length
      } items for a total of <strong>$${emailSendObject.amount}</strong>.</p>
      <ul>
        ${emailSendObject.products
          .map((item) => `<li>${item.name}: $${item.price}</li>`)
          .join("")}
      </ul>
    `;

    const responseEmail = await emailService.sendEmail({
      to: emailSendObject.emailUser,
      subject: `Purchase confirmation: ${emailSendObject.orderId}`,
      html,
    });

    console.log("responseEmail", responseEmail);

    if (noStockProducts.length > 0) {
      return Response(
        res,
        {
          productsNotProcessed: noStockProducts,
          purchaseId: response.id,
        },
        cartErrorCodes.ERROR_PARTIAL_PURCHASE,
        200,
        true
      );
    }

    return Response(
      res,
      { purchaseId: response.id },
      cartSuccessCodes.SUCCESS_PURCHASE,
      200,
      true
    );
  } catch (error) {
    if (error.message === cartErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);

    if (error.message === cartErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    if (error.message === productErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);

    if (error.message === productErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};
