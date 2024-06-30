const csv = require("csvtojson");
const { default: mongoose } = require("mongoose");
require('dotenv').config();
const cloudinary = require('cloudinary');
const ProductItem = require("./src/model/ProductItem");


const mongodbUrl = "mongodb+srv://tvphuc2k4:tvphuc2k4@cluster0.usqu2x8.mongodb.net/shop"
mongoose.connect(mongodbUrl)
    .then(() => console.log("Connected to MongoDB: " + mongodbUrl))
    .catch((e) => console.log(e));

const createProductItem = async () => {
    const data = await csv().fromFile("./src/csv/clothes_price_prediction_data.csv")

    const newData = data.slice(0, 5).map((element) => {
        return {
            productId: "6678267e45607f0a91c48e76",
            color: element.Color,
            size: element.Size,
            quantity: Math.ceil(Math.random() * 100)
        }
    })
    await ProductItem.create(newData)
    console.log("Product Item Created !")
}

createProductItem()