// src/dto/order.dto.js
import ProductDTO from "./product.dto.js";

export default class OrderDTO {
  constructor(order) {
    this.id = order._id ? order._id.toString() : null;
    this.code = order.code || null;
    this.amount = order.amount || 0;
    this.products = order.products
      ? order.products.map((product) => ({
          ...product,
          product: product.product
            ? ProductDTO.fromMongoDocument(product.product)
            : null,
        }))
      : [];
    this.user = order.user ? order.user.toString() : null;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
  }

  static fromMongoDocument(order) {
    return new OrderDTO({
      _id: order._id.toString(),
      code: order.code || null,
      amount: order.amount || 0,
      products: order.products.map((product) => ({
        product: product.product,
        quantity: product.quantity,
      })),
      user: order.user ? order.user.toString() : null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  }

  static fromMongoDocumentList(orders) {
    return orders.map((order) => new OrderDTO(order));
  }
}
