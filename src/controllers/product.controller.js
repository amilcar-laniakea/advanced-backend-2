import {
  productErrorCodes,
  productSuccessCodes,
} from "../constants/product.constants.js";
import { exceptionErrors } from "../constants/general.constants.js";
import {
  serviceGetProducts,
  serviceGetProduct,
  serviceCreateProduct,
  serviceUpdateProduct,
  serviceDeleteProduct,
} from "../services/product.service.js";
import ProductDTO from "../DTO/product.dto.js";
import { Response } from "../utils/response.js";

export const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const category = req.query.category || "";
    const status = req.query.status || "";
    const name = req.query.name || "";
    const stock = req.query.stock || "";
    const code = parseInt(req.query.code) || null;
    const sort = req.query.sort || "";

    const request = await serviceGetProducts(
      page,
      limit,
      category,
      status,
      name,
      stock,
      code,
      sort
    );

    return Response(res, request);
  } catch (error) {
    if (error.message === productErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await serviceGetProduct(String(req.params.id));

    return Response(res, product);
  } catch (error) {
    if (error.message === productErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);

    if (error.message === productErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = new ProductDTO(req.body);

    const response = await serviceCreateProduct(product);

    return Response(res, response, productSuccessCodes.SUCCESS_CREATE, 201);
  } catch (error) {
    if (
      error.name === exceptionErrors.VALIDATION_ERROR ||
      error.message === productErrorCodes.UNEXPECTED_ERROR ||
      error.errorResponse?.code === 11000
    )
      return Response(res, null, error.message, 400, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      code,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;

    const product = {
      name,
      description,
      price,
      code,
      status,
      stock,
      category,
      thumbnail,
    };

    const productUpdate = await serviceUpdateProduct(req.params.id, product);

    return Response(
      res,
      { ...productUpdate._doc, ...product },
      productSuccessCodes.SUCCESS_UPDATE,
      200
    );
  } catch (error) {
    if (error.message === productErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    if (
      error.name === exceptionErrors.CAST_ERROR ||
      error.errorResponse.code === 11000
    )
      return Response(res, null, error.message, 400, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const response = await serviceDeleteProduct(req.params.id);

    return Response(res, response, productSuccessCodes.SUCCESS_DELETE, 200);
  } catch (error) {
    if (error.message === productErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    if (error.name === exceptionErrors.CAST_ERROR)
      return Response(res, null, error.message, 400, false);

    return Response(res, null, error.message, 500, false);
  }
};
