const { catchAsync, AppError, sendResponse } = require("../../helpers/utils")
const CartItem = require("../../model/CarItem")

const getCartItems = catchAsync(async (req, res, next) => {
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

module.exports = getCartItems;