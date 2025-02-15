const csv = require("csvtojson");
const { faker } = require("@faker-js/faker");
const Product = require("../model/Product");
const { default: mongoose } = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const mongodbUrl =
  "mongodb+srv://tvphuc2k4:tvphuc2k4@cluster0.usqu2x8.mongodb.net/shop";
mongoose
  .connect(mongodbUrl)
  .then(() => console.log("Connected to MongoDB: " + mongodbUrl))
  .catch((e) => console.log(e));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const createProduct = async () => {
  let data = await csv().fromFile("images.csv");
  data = data.slice(0, 100).map((e) => {
    return { image: e.image };
  });

  console.log("creating...");

  data.forEach(async (e) => {
    const image = await cloudinary.uploader
      .upload(`../image/images_compressed/${e.image}.jpg`)
      .catch((e) => console.log(e));

    const url = cloudinary.url(image.public_id, {
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 500, height: 600 },
      ],
    });

    await Product.create({
      name: faker.commerce.productName(),
      brand: "Adidas",
      image: `${url}`,
      description: faker.commerce.productDescription(),
      category: "Trousers",
    });
  });

  console.log("done !");
};

createProduct();
