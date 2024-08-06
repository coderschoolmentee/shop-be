const { catchAsync, AppError, sendResponse } = require("../../helpers/utils");
const CartItem = require("../../model/CartItem");

const getSingleCartItem = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId
    const { id } = req.params

    const cartItem = await CartItem.find({ _id: id, userId: currentUserId })

    if (!cartItem.length) throw new AppError(404, "No CartItem found", "Get Single CartItem failed");

    sendResponse(res, 200, true, cartItem, null, "Get Single CartItem success")
})

module.exports = getSingleCartItem;