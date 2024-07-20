const { default: mongoose } = require("mongoose");
require('dotenv').config();
const cloudinary = require('cloudinary');

const mongodbUrl = "mongodb+srv://tvphuc2k4:tvphuc2k4@cluster0.usqu2x8.mongodb.net/shop"
mongoose.connect(mongodbUrl)
    .then(() => console.log("Connected to MongoDB: " + mongodbUrl))
    .catch((e) => console.log(e));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});