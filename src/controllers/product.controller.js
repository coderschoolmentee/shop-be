const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Product = require("../model/Product");

const productController = {}


productController.filterProduct = catchAsync(async (req, res, next) => {
    const data = req["body"]
    const { page, limit } = req.query

    // Business Validation
    const filterConditions = [data]
    const filterCriterial = filterConditions.length ? { $and: filterConditions } : {};

    // Process
    const count = await Product.countDocuments(filterCriterial)
    const totalPages = Math.ceil(count / limit)
    const offset = limit * (page - 1)

    const products = await Product.find(filterCriterial)
        .limit(limit).skip(offset)

    sendResponse(res, 200, true, { data: products, totalPages, count }, null, "Filter products successfully")
})

productController.getSingleProduct = catchAsync(async (req, res, next) => {
    const productId = req.params.id

    const product = await Product.findById(productId)
    if (!product) throw new AppError(404, "Product not found", "Find detail product failed")

    sendResponse(res, 200, true, { data: product }, null, "Find product successfully")
})

productController.getProducts = catchAsync(async (req, res, next) => {
    // Get data from request
    let { page, limit, search } = req.query

    // Process
    let filterConditions = []
    if (search) {
        const value = { name: { $regex: search, $options: "i" } }
        filterConditions.push(value)
    }
    const filterCriterial = filterConditions.length ? { $and: filterConditions } : {};

    const count = await Product.countDocuments()
    const totalPages = Math.ceil(count / limit)
    const offset = limit * (page - 1)

    const products = await Product.find(filterCriterial)
        .limit(limit)
        .skip(offset)

    // Customize value with Set for model product
    const size = new Set(products.map(element => element.size))
    const sizes = Array.from(size)
    const category = new Set(products.map(element => element.category))
    const categories = Array.from(category)
    const brand = new Set(products.map(element => element.brand))
    const brands = Array.from(brand)

    // Response
    sendResponse(res, 200, true, { sizes, categories, brands, products, totalPages, count }, null, "Get products successfully")
})

module.exports = productController;