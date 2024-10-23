import {
  productErrorCodes,
  productSuccessCodes,
} from "../constants/product.constants.js";
import { exceptionErrors } from "../constants/general.constants.js";
import Product from "../dao/classes/product.dao.js";
import ProductDTO from "../dto/product.dto.js";
import { Response } from "../utils/response.js";

const productService = new Product();

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

    const request = await productService.getProducts(
      page,
      limit,
      category,
      status,
      name,
      stock,
      code,
      sort
    );

    const productsDTO = ProductDTO.fromMongoDocumentList(request.docs);

    return Response(res, { ...request, docs: productsDTO });
  } catch (error) {
    if (error.message === productErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await productService.getProduct(String(req.params.id));
    const productDTO = ProductDTO.fromMongoDocument(product);

    return Response(res, productDTO);
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

    const response = await productService.createProduct(product);

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

    const productUpdate = await productService.updateProduct(
      req.params.id,
      product
    );

    const productDTO = ProductDTO.fromMongoDocument(productUpdate);

    return Response(res, productDTO, productSuccessCodes.SUCCESS_UPDATE, 200);
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
    const response = await productService.deleteProduct(req.params.id);

    const productDTO = ProductDTO.fromMongoDocument(response);

    return Response(res, productDTO, productSuccessCodes.SUCCESS_DELETE, 200);
  } catch (error) {
    if (error.message === productErrorCodes.NOT_FOUND)
      return Response(res, null, error.message, 404, false);

    if (error.name === exceptionErrors.CAST_ERROR)
      return Response(res, null, error.message, 400, false);

    return Response(res, null, error.message, 500, false);
  }
};
