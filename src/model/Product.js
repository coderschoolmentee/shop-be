const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = Schema({
    name: { type: String },
    brand: { type: String, default: "" },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
}, { timestamps: true })

const Product = model("Product", productSchema)
module.exports = Product;