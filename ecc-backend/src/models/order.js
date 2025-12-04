// src/models/order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  role: {
    type: String, // encontrista | encontreiro
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String, // pix | card
    required: true
  },
  paymentId: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  }
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);

export default Order;
