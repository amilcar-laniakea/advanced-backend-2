import { orderErrorCodes } from "../constants/order.constants.js";
import { Response } from "../utils/response.js";
import {
  serviceGetOrders,
  serviceGetOrder,
} from "../services/order.service.js";

export const getOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const code = parseInt(req.query.code) || null;
    const sort = req.query.sort || "";

    const request = await serviceGetOrders({
      page,
      limit,
      code,
      sort,
    });

    return Response(res, request);
  } catch (error) {
    if (error.message === orderErrorCodes.NOT_FOUND_ORDER)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await serviceGetOrder(String(req.params.id));

    return Response(res, order);
  } catch (error) {
    if (error.message === orderErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);

    if (error.message === orderErrorCodes.NOT_FOUND_ORDER)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};
