const csv = require("csvtojson");
const { faker } = require("@faker-js/faker");
const Product = require("./src/model/Product");
const { default: mongoose } = require("mongoose");
require('dotenv').config();
const cloudinary = require('cloudinary');


const mongodbUrl = "mongodb+srv://tvphuc2k4:tvphuc2k4@cluster0.usqu2x8.mongodb.net/shop"
mongoose.connect(mongodbUrl)
    .then(() => console.log("Connected to MongoDB: " + mongodbUrl))
    .catch((e) => console.log(e));


cloudinary.config({})

const createProduct = async () => {
    const data = await csv().fromFile("./src/csv/clothes_price_prediction_data.csv")

    const newData = data.map((element) => {
        const name = faker.commerce.productName()
        const description = faker.commerce.productDescription()

        return {
            name,
            price: element.Price,
            brand: element.Brand,
            category: element.Category,
            description,
        }
    })
    await Product.create(newData)
    console.log("Product Created !")
}

createProduct()