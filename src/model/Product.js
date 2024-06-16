const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = Schema({
    name: { type: String },
    price: { type: String },
    brand: { type: String, default: "" },
    category: { type: String, default: "" },
    image: { type: String, default: "" },
    size: { type: String, default: "" },
    description: { type: String, default: "" },
}, { timestamps: true })

const Product = model("Product", productSchema)
module.exports = Product;