import Product from "../models/product.model.js";
import { isValidObjectId } from "../utils/is-valid-object-id.js";
import { productErrorCodes } from "../constants/product.constants.js";
import { isBooleanString } from "../utils/is-boolean-string.js";

export const getAllProducts = async (
  page,
  limit,
  category,
  status,
  name,
  stock,
  code,
  sort
) => {
  const query = {};
  let sortOption = {};

  if (name) query.name = { $regex: name, $options: "i" };
  if (category) query.category = category;
  if (status) query.status = status;
  if (code) query.code = { $eq: code };

  const validSortOrders = ["asc", "desc"];

  if (validSortOrders.includes(sort)) {
    const sortValue = sort === "desc" ? -1 : 1;
    sortOption = { price: sortValue };
  }

  if (isBooleanString(stock) === true) query.stock = { $gt: 1 };
  else if (isBooleanString(stock) === false) query.stock = { $eq: 0 };

  const products = await Product.paginate(query, {
    page,
    limit,
    sort: sortOption,
    lean: true,
  });

  if (products.totalDocs === 0) throw new Error(productErrorCodes.NOT_FOUND);

  return products;
};

export const getProductById = async (id) => {
  if (!isValidObjectId(id) && isNaN(Number(id)))
    throw new Error(productErrorCodes.INVALID_FORMAT);

  const product = await (!isNaN(id)
    ? Product.findOne({ code: id })
    : Product.findById(id));

  if (!product) throw new Error(productErrorCodes.NOT_FOUND);

  return product;
};

export const createProduct = async (data) => {
  const productRequest = new Product(data);
  const product = await productRequest.save();

  if (!product) {
    throw new Error(productErrorCodes.UNEXPECTED_ERROR);
  }

  return product;
};

export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data);

  if (!product) {
    throw new Error(productErrorCodes.NOT_FOUND);
  }

  return product;
};

export const deleteProduct = async (id) => {
  if (!isValidObjectId(id) && isNaN(Number(id))) {
    throw new Error(productErrorCodes.INVALID_FORMAT);
  }

  const product = await (!isNaN(id)
    ? Product.deleteOne({ code: id })
    : Product.findByIdAndDelete(id));

  if (!product) {
    throw new Error(productErrorCodes.NOT_FOUND);
  }

  return product;
};
