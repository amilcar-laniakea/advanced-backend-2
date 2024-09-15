import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    cart_id: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);

const userModel = "User";
const userCollection = "users";

const User = model(userModel, userSchema, userCollection);

export default User;
