const { catchAsync, AppError, sendResponse } = require("../../helpers/utils");
const CartItem = require("../../model/CarItem");
const ProductItem = require("../../model/ProductItem");

const deleteCartItem = catchAsync(async (req, res, next) => {
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

module.exports = deleteCartItem;