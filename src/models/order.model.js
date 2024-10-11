import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const orderSchema = new Schema(
  {
    code: {
      type: Number,
      index: true,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.plugin(mongoosePaginate);

const orderModel = "Order";
const orderCollection = "orders";

const Order = model(orderModel, orderSchema, orderCollection);

export default Order;
