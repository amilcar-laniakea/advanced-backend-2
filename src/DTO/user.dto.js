import CartDTO from "./cart.dto.js";
export default class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role ? user.role.toLowerCase() : undefined;
    this.cart = user.cart_id ? CartDTO.fromMongoDocument(user.cart_id) : null;
  }

  toObject() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      age: this.age,
      role: this.role,
      cart: this.cart_id,
    };
  }

  static fromRequestBody(body) {
    return new UserDTO({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      age: body.age,
      role: typeof body.role === "string" ? body.role.toLowerCase() : undefined,
      cart: body.cart_id,
    });
  }

  static fromMongoDocument(mongoDoc) {
    return new UserDTO(mongoDoc);
  }
}
