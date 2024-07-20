const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Product = require("../model/Product");
const ProductItem = require("../model/ProductItem");
const User = require("../model/User");

const productController = {}

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
        .populate("productItemId")

    // Response
    sendResponse(res, 200, true, { products, totalPages, count }, null, "Get products successfully")
})

productController.getSingleProduct = catchAsync(async (req, res, next) => {
    const productId = req.params.id

    const product = await Product.findById(productId).populate("productItemId")
    if (!product) throw new AppError(404, "Product not found", "Find detail product failed")

    sendResponse(res, 200, true, product, null, "Find product successfully")
})

productController.getAllProductItems = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const productItems = await ProductItem.find({ productId: id }).populate("productId")
    if (!productItems) throw new AppError(404, "ProductItem not found", "Get all productItems failed")

    sendResponse(res, 200, true, productItems, null, "Get product variants successfully")
})


productController.createProduct = catchAsync(async (req, res, next) => {
    const data = req.body
    const currentUserId = req.userId

    const user = await User.findById(currentUserId)
    if (!user) throw new AppError(404, "User not found", "Product creation failed")
    if (user.roles !== "admin") throw new AppError(403, "You not allowed to access", "Creation failed")

    const product = await Product.find({ name: data.name })
    if (product.length) throw new AppError(409, "Product already exists", "Product creation failed")

    const createdProduct = await Product.create(data)

    sendResponse(res, 201, true, createdProduct, null, "Create product successfully !")
})

productController.updateProduct = catchAsync(async (req, res, next) => {
    const data = req.body
    const currentUserId = req.userId
    const { id } = req.params

    const user = await User.findById(currentUserId)
    if (!user) throw new AppError(404, "User not found", "Product update failed")
    if (user.roles !== "admin") throw new AppError(403, "You not allowed to access", "Update failed")

    const product = await Product.findByIdAndUpdate(id, data, { new: true })
    if (!product) throw new AppError(500, "Server error", "Product update failed")

    sendResponse(res, 200, true, product, null, "Update product successfully")
})

productController.deleteProduct = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId
    const { id } = req.params

    const user = await User.findById(currentUserId)
    if (!user) throw new AppError(404, "User not found", "Product delete failed")
    if (user.roles !== "admin") throw new AppError(403, "You not allowed to access", "Delete failed")

    const product = await Product.findByIdAndDelete(id)
    if (!product) throw new AppError(500, "Server error", "Product delete failed")

    sendResponse(res, 200, true, null, null, "Delete product successfully")
})

module.exports = productController;