import Order from "../dao/classes/order.dao.js";

import { orderErrorCodes } from "../constants/order.constants.js";
import { Response } from "../utils/response.js";
import OrderDTO from "../dto/order.dto.js";

const orderService = new Order();

export const getOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const code = parseInt(req.query.code) || null;
    const sort = req.query.sort || "";

    const request = await orderService.getOrders({
      page,
      limit,
      code,
      sort,
    });

    const ordersDTO = OrderDTO.fromMongoDocumentList(request.docs);

    return Response(res, { ...request, docs: ordersDTO });
  } catch (error) {
    if (error.message === orderErrorCodes.NOT_FOUND_ORDER)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await orderService.getOrder(String(req.params.id));
    const orderDTO = OrderDTO.fromMongoDocument(order);

    return Response(res, orderDTO);
  } catch (error) {
    if (error.message === orderErrorCodes.INVALID_FORMAT)
      return Response(res, null, error.message, 400, false);

    if (error.message === orderErrorCodes.NOT_FOUND_ORDER)
      return Response(res, null, error.message, 404, false);

    return Response(res, null, error.message, 500, false);
  }
};
