import ProductDTO from "./product.dto.js";

export default class CartDTO {
  constructor(cart) {
    this.id = cart._id ? cart._id.toString() : null;
    this.user = cart.user ? cart.user.toString() : null;
    this.status = cart.status;
    this.products = cart.products
      ? cart.products.map((product) => ({
          id: product._id ? product._id.toString() : null,
          product: ProductDTO.fromMongoDocument(product.product),
          quantity: product.quantity,
        }))
      : [];
    this.createdAt = cart.createdAt;
    this.updatedAt = cart.updatedAt;
  }

  static fromMongoDocument(cart) {
    return new CartDTO(cart);
  }

  static fromMongoDocumentList(cartDocs) {
    return cartDocs.map((cart) => new CartDTO(cart));
  }
}
