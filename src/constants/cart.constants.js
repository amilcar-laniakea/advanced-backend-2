export const cartSuccessCodes = {
  SUCCESS_CREATE: "success create cart",
  SUCCESS_DELETE: "success delete cart",
  SUCCESS_ADD_PRODUCT: "success add product to cart",
  SUCCESS_DELETE_PRODUCT: "success delete product from cart",
};

export const cartErrorCodes = {
  INVALID_FORMAT: "invalid cart id format",
  NOT_FOUND_PRODUCT: "product not found",
  NOT_ENOUGH_STOCK: "not enough stock",
  NOT_FOUND: "cart(s) not found",
  UNEXPECTED_ERROR: "unexpected",
  ERROR_DUPLICATE: "the user has already a cart active.",
  ERROR_UNAUTHORIZED:
    " you are not authorized to perform this action (the cart belongs to another user)",
  ERROR_PURCHASE: " all the products in the cart are out of stock.",
  ERROR_PARTIAL_PURCHASE: "some products in the cart are out of stock.",
};
