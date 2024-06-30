const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const CartItem = require("../model/CarItem");
const Product = require("../model/Product");
const ProductItem = require("../model/ProductItem");

const cartItemController = {}

cartItemController.createCartItem = catchAsync(async (req, res, next) => {
    const { productItemId, quantity } = req.body
    const currentUserId = req.userId

    let productItem = await ProductItem.findById(productItemId)
    let cartItem = await CartItem.findOne({ userId: currentUserId, productItemId })

    if (!productItem) throw new AppError(404, "ProductItem not found", "createCartItem failed")
    let productQuantity = productItem.quantity

    if (quantity > productQuantity) throw new AppError(400, "The item in product can not enough quantity", "createCartItem failed")


    if (cartItem) {
        if (quantity <= productQuantity) {
            cartItem.quantity += quantity
            productQuantity -= quantity
            cartItem.save()
            await ProductItem.findByIdAndUpdate(productItemId, { quantity: productQuantity }, { new: true })
        } else {
            throw new AppError(400, "over limit quantity", "createCartItem failed")
        }
    } else {
        cartItem = await CartItem.create({ productItemId, userId: currentUserId, quantity })
    }

    sendResponse(res, 201, true, { data: cartItem }, null, "createCartItem success")

})

cartItemController.getCartItems = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId
    const { page, limit } = req.query

    const user = await CartItem.find({ userId: currentUserId })

    if (!user) throw new AppError(404, "User not found", "Get list cartItems by currentUserId failed")

    const count = await CartItem.countDocuments({ userId: currentUserId })
    const totalPages = Math.ceil(count / limit)
    const offset = limit * (page - 1)

    const cartItems = await CartItem.find({ userId: currentUserId })
        .sort({ createdAt: - 1 })
        .limit(limit).skip(offset)
        .populate("productItemId")
    console.log(cartItems)
    if (!cartItems.length) throw new AppError(404, "No CartItems found", "Get list cartItems failed")

    sendResponse(res, 200, true, { data: cartItems, totalPages, count }, null, "Get list cartItems success")
})

cartItemController.getSingleCartItem = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId
    const { id } = req.params

    const cartItem = await CartItem.find({ productItemId: id, userId: currentUserId })

    if (!cartItem.length) throw new AppError(404, "No CartItem found", "Get Single CartItem failed");

    sendResponse(res, 200, true, { data: cartItem }, null, "Get Single CartItem success")

})

cartItemController.updateCartItem = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId
    const { id } = req.params
    const { quantity } = req.body

    let cartItem = await CartItem.find({ productItemId: id, userId: currentUserId })
    if (!cartItem.length) throw new AppError(404, "No CartItem found", "Update CartItem failed");

    cartItem[0].quantity = quantity
    cartItem[0].save()

    sendResponse(res, 200, true, { data: cartItem }, null, "Update CartItem success")
})

cartItemController.deleteCartItem = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const chectExists = await CartItem.findById(id)
    if (!chectExists) throw new AppError(404, "The CartItem does not exist", "Delete CartItem failed");

    const cartItem = await CartItem.findByIdAndDelete(id)
    const cartItemQuantity = cartItem.quantity
    const productItemId = cartItem.productItemId
    await ProductItem.findByIdAndUpdate(productItemId, { quantity: cartItemQuantity }, { new: true })

    if (!cartItem) throw new AppError(500, "Server error", "Delete CartItem failed");

    sendResponse(res, 204, true, null, null, "Delete CartItem success")
})

module.exports = cartItemController;