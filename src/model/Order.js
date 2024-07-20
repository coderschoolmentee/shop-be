const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    totalPrices: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true, enum: ["pending", "accepted", "delivery", "received", "returns", "returned"] }
}, { timestamps: true })

const Order = model("Order", orderSchema)
module.exports = Order;