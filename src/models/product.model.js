import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    code: {
      type: Number,
      index: true,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

const productModel = "Product";
const productCollection = "products";

const Product = model(productModel, productSchema, productCollection);

export default Product;
