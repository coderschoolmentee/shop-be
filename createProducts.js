const csv = require("csvtojson");
const { faker } = require("@faker-js/faker");
const Product = require("./src/model/Product");
const { default: mongoose } = require("mongoose");
require('dotenv').config();

const mongodbUrl = process.env.MONGODB_URL
mongoose.connect(mongodbUrl)
    .then(() => console.log("Connected to MongoDB: " + mongodbUrl))
    .catch((e) => console.log(e));


const createProductPokemon = async () => {
    const data = await csv().fromFile("./src/csv/clothes_price_prediction_data.csv")

    const newData = data.map((element, index) => {
        const imageUrl = `http://localhost:5000/images/clothes${index}.jpg`
        console.log(imageUrl);
        const name = faker.commerce.productName()
        const description = faker.commerce.productDescription()
        return {
            name,
            price: element.Price,
            brand: element.Brand,
            category: element.Category,
            size: element.Size,
            description
        }
    })
    // await Product.create(newData)
    console.log("done creating product")
}

createProductPokemon()