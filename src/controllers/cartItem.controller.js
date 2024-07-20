const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const CartItem = require("../model/CarItem");
const ProductItem = require("../model/ProductItem");

const cartItemController = {}

cartItemController.createCartItem = catchAsync(async (req, res, next) => {
    // Get data from request
    const { productItemId, quantity } = req.body
    const currentUserId = req.userId

    //Business validation
    let productItem = await ProductItem.findById(productItemId)
    let cartItem = await CartItem.findOne({ userId: currentUserId, productItemId })

    if (!productItem) throw new AppError(404, "Product variants not found", "createCartItem failed")
    let productQuantity = productItem.quantity

    if (quantity > productQuantity) throw new AppError(400, "The item in product can not enough quantity", "createCartItem failed")

    //Process
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
        productQuantity -= quantity
        await ProductItem.findByIdAndUpdate(productItemId, { quantity: productQuantity }, { new: true })
    }

    //Response
    sendResponse(res, 201, true, cartItem, null, "Add to cart succeess !")

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

    sendResponse(res, 200, true, { cartItems, totalPages, count }, null, "Get list cartItems success")
})

cartItemController.getSingleCartItem = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId
    const { id } = req.params

    const cartItem = await CartItem.find({ _id: id, userId: currentUserId })

    if (!cartItem.length) throw new AppError(404, "No CartItem found", "Get Single CartItem failed");

    sendResponse(res, 200, true, cartItem, null, "Get Single CartItem success")

})

cartItemController.updateCartItem = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId
    const { id } = req.params
    const { quantity } = req.body

    let cartItem = await CartItem.find({ _id: id, userId: currentUserId })
    if (!cartItem.length) throw new AppError(404, "No CartItem found", "Update CartItem failed");

    const currentQuantity = cartItem[0].quantity

    cartItem[0].quantity = quantity
    cartItem[0].save()

    const productItemId = cartItem[0].productItemId
    const productItem = await ProductItem.findById(productItemId)
    let newQuantity = 0

    if (quantity > currentQuantity) {
        const calculatedQuantity = quantity - currentQuantity
        newQuantity = productItem.quantity - calculatedQuantity
    } else if (quantity === currentQuantity) {
        newQuantity = productItem.quantity
    } else {
        const calculatedQuantity = currentQuantity - quantity
        newQuantity = productItem.quantity + calculatedQuantity
    }

    await ProductItem.findOneAndUpdate({ _id: productItemId }, { quantity: newQuantity }, { new: true })

    sendResponse(res, 200, true, cartItem, null, "Update CartItem success")
})

cartItemController.deleteCartItem = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const chectExists = await CartItem.findById(id)
    if (!chectExists) throw new AppError(404, "The CartItem does not exist", "Delete CartItem failed");

    const cartItem = await CartItem.findByIdAndDelete(id)

    const productItemId = cartItem.productItemId
    const productItem = await ProductItem.findById(productItemId)
    const cartItemQuantity = cartItem.quantity
    const newQuantity = productItem.quantity + cartItemQuantity

    await ProductItem.findOneAndUpdate({ _id: productItemId }, { quantity: newQuantity })

    if (!cartItem) throw new AppError(500, "Server error", "Delete CartItem failed");

    sendResponse(res, 204, true, null, null, "Delete CartItem success")
})

module.exports = cartItemController;