const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Product = require("../model/Product");
const ProductItem = require("../model/ProductItem");
const User = require("../model/User");

const productItemsController = {}


productItemsController.createProductItem = catchAsync(async (req, res, next) => {
    const data = req.body
    const { productId } = data
    const currentUserId = req.userId

    const user = await User.findById(currentUserId)
    if (!user) throw new AppError(404, "User not found", "Product creation failed")
    if (user.roles !== "admin") throw new AppError(403, "You not allowed to access", "Creation failed")

    const product = await Product.findById(productId)
    if (!product) throw new AppError(404, "Product not found", "ProductItem creation failed")

    const productItem = await ProductItem.create(data)

    sendResponse(res, 201, true, { data: productItem }, null, "Create productItem successfully")
})

productItemsController.updateProductItem = catchAsync(async (req, res, next) => {
    const data = req.body
    const currentUserId = req.userId
    const { id } = req.params

    const user = await User.findById(currentUserId)
    if (!user) throw new AppError(404, "User not found", "Product update failed")
    if (user.roles !== "admin") throw new AppError(403, "You not allowed to access", "Update failed")

    const productItem = await ProductItem.findByIdAndUpdate(id, data, { new: true })

    sendResponse(res, 200, true, { data: productItem }, null, "Update productItem successfully")
})

productItemsController.deleteProductItem = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId
    const { id } = req.params

    const user = await User.findById(currentUserId)
    if (!user) throw new AppError(404, "User not found", "Product delete failed")
    if (user.roles !== "admin") throw new AppError(403, "You not allowed to access", "Delete failed")

    const productItem = await ProductItem.findById(id)
    if (!productItem) throw new AppError(404, "ProductItem not found", "Delete failed")

    await ProductItem.findByIdAndDelete(id)

    sendResponse(res, 204, true, null, null, "Delete productItem successfully")
})



module.exports = productItemsController;