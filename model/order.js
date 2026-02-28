import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: String,

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: Number,
      price: Number
    }
  ],

  delivery: {
    name: String,
    phone: String,
    address: String,
    city: String
  },

  userId: {
      type: mongoose.Schema.Types.ObjectId,
       ref: "user",
      required: true,
    },
  

  totalAmount: Number,
  paymentReference: String,
  paymentStatus: { type: String, default: "paid" },

  status: {
  type: String,
  enum: ["paid", "processing", "shipped", "delivered"],
  default: "paid"
},

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);