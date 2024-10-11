import Order from "../models/order.model.js";
import { isValidObjectId } from "../utils/is-valid-object-id.js";
import { orderErrorCodes } from "../constants/order.constants.js";

export const serviceGetOrders = async ({
  page,
  limit,
  code,
  sort,
  bypassError,
}) => {
  const query = {};
  let sortOption = {};

  if (code) query.code = { $eq: code };

  const validSortOrders = ["asc", "desc"];

  if (validSortOrders.includes(sort)) {
    const sortValue = sort === "desc" ? -1 : 1;
    sortOption = { price: sortValue };
  }

  const orders = await Order.paginate(query, {
    page,
    limit,
    sort: sortOption,
    lean: true,
  });

  if (orders.totalDocs === 0 && !bypassError)
    throw new Error(orderErrorCodes.NOT_FOUND_ORDER);

  return orders;
};

export const serviceGetOrder = async (id) => {
  if (!isValidObjectId(id) && isNaN(Number(id)))
    throw new Error(orderErrorCodes.INVALID_FORMAT);

  const order = await (!isNaN(id)
    ? Order.findOne({ code: id })
    : Order.findById(id));

  if (!order) throw new Error(productErrorCodes.NOT_FOUND_ORDER);

  return order;
};

export const serviceCreateOrder = async (data) => {
  const orderRequest = new Order(data);
  const order = await orderRequest.save();

  if (!order) {
    throw new Error(orderErrorCodes.UNEXPECTED_ERROR);
  }

  return order;
};
