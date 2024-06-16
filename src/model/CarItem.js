const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const cartItemSchema = Schema({
    productId: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    quantity: { type: Number, required: true }
}, { timestamps: true })

const CartItem = model("CartItem", cartItemSchema)
module.exports = CartItem;