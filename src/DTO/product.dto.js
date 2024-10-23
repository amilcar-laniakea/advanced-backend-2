export default class ProductDTO {
  constructor(product) {
    this.id = product._id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.code = product.code;
    this.status = product.status;
    this.stock = product.stock;
    this.category = product.category;
    this.thumbnail = product.thumbnail;
  }

  static fromMongoDocument(body) {
    return new ProductDTO({
      _id: body._id.toString(),
      name: body.name,
      description: body.description,
      price: body.price,
      code: body.code,
      status: body.status,
      stock: body.stock,
      category: body.category,
      thumbnail: body.thumbnail,
    });
  }

  static fromMongoDocumentList(productDocs) {
    return productDocs.map((product) => new ProductDTO(product));
  }
}
