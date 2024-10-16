import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 }, { unique: true });

cartSchema.plugin(mongoosePaginate);

const cartModel = "Cart";
const cartCollection = "carts";

const Cart = model(cartModel, cartSchema, cartCollection);

export default Cart;
