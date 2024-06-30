const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const productItemSchema = Schema({
    productId: { type: Types.ObjectId, required: true, ref: "Product" },
    color: { type: String },
    size: { type: String },
    price: { type: Number },
    image: { type: String, default: "" },
    quantity: { type: Number }
}, { timestamps: true })

const ProductItem = model("ProductItem", productItemSchema)
module.exports = ProductItem;