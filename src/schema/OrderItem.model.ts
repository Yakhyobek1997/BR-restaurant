import mongoose, { Schema } from "mongoose";

// Orderlar qaysi orderga bogliqligini anglatadi
// Schema modellarini o'qib berib, 
// Collection nomini ko'plida taxlab beradi
const orderItemSchema = new Schema(
  {
    itemQuantity: { 
      type: Number,
      required: true,
    },

    itemPrice: {
      type: Number,
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId, 
      ref: "Order",
    },

    productId: { // order Item qaysi product da xosil bolgan
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true, collection: "orderItems" }
);

export default mongoose.model("OrderItem", orderItemSchema);