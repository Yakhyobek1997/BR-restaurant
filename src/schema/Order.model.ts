import mongoose, { Schema } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";

const orderSchema = new Schema( // orderSchema modelni xosil qildik
  {
    orderTotal: { // orderTotal datasetni xosil qildik
      type: Number,
      required: true,
    },

    orderDelivery: {  // orderDelivery dataset
      type: Number,
      required: true,
    },

    orderStatus: { 
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PAUSE,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
  },
  { timestamps: true, collection: "orders" }
);

export default mongoose.model("Order", orderSchema);

// Keyin orderga daxildor bolgan enumni xosil qilamiz