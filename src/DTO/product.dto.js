export default class ProductDTO {
  constructor(product) {
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.code = product.code;
    this.status = product.status;
    this.stock = product.stock;
    this.category = product.category;
    this.thumbnail = product.thumbnail;
  }
}
