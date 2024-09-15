import {
  productErrorCodes,
  productSuccessCodes,
} from "../constants/product.constants.js";
import { exceptionErrors } from "../constants/general.constants.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";
import { Response } from "../utils/response.js";

class ProductController {
  constructor() {
    this.products = [];
  }

  async getProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const category = req.query.category || "";
      const status = req.query.status || "";
      const name = req.query.name || "";
      const stock = req.query.stock || "";
      const code = parseInt(req.query.code) || null;
      const sort = req.query.sort || "";

      this.products = await getAllProducts(
        page,
        limit,
        category,
        status,
        name,
        stock,
        code,
        sort
      );

      return Response(res, this.products);
    } catch (error) {
      if (error.message === productErrorCodes.NOT_FOUND)
        return Response(res, null, error.message, 404, false);

      return Response(res, null, error.message, 500, false);
    }
  }

  async getProductById(res, id) {
    try {
      this.products = await getProductById(id);

      return Response(res, this.products);
    } catch (error) {
      if (error.message === productErrorCodes.INVALID_FORMAT) {
        return Response(res, null, error.message, 400, false);
      }

      if (error.message === productErrorCodes.NOT_FOUND) {
        return Response(res, null, error.message, 404, false);
      }

      return Response(res, null, error.message, 500, false);
    }
  }

  async createProduct(
    res,
    { name, description, price, code, status, stock, category, thumbnail = "" }
  ) {
    try {
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

      const response = await createProduct(product);

      return Response(res, response, productSuccessCodes.SUCCESS_CREATE, 201);
    } catch (error) {
      if (
        error.name === exceptionErrors.VALIDATION_ERROR ||
        error.message === productErrorCodes.UNEXPECTED_ERROR ||
        error.errorResponse.code === 11000
      ) {
        return Response(res, null, error.message, 400, false);
      }

      return Response(res, null, error.message, 500, false);
    }
  }

  async updateProduct(
    res,
    id,
    { name, description, price, code, status, stock, category, thumbnail }
  ) {
    try {
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

      const productUpdate = await updateProduct(id, product);

      return Response(
        res,
        { ...productUpdate._doc, ...product },
        productSuccessCodes.SUCCESS_UPDATE,
        200
      );
    } catch (error) {
      if (error.message === productErrorCodes.NOT_FOUND) {
        return Response(res, null, error.message, 404, false);
      }

      if (
        error.name === exceptionErrors.CAST_ERROR ||
        error.errorResponse.code === 11000
      ) {
        return Response(res, null, error.message, 400, false);
      }

      return Response(res, null, error.message, 500, false);
    }
  }

  async deleteProduct(res, id) {
    try {
      this.products = await deleteProduct(id);

      return Response(
        res,
        this.products,
        productSuccessCodes.SUCCESS_DELETE,
        200
      );
    } catch (error) {
      if (error.message === productErrorCodes.NOT_FOUND) {
        return Response(res, null, error.message, 404, false);
      }

      if (error.name === exceptionErrors.CAST_ERROR) {
        return Response(res, null, error.message, 400, false);
      }

      return Response(res, null, error.message, 500, false);
    }
  }
}

export default ProductController;
