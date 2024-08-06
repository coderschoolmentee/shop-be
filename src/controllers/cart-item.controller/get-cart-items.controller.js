const { catchAsync, AppError, sendResponse } = require("../../helpers/utils")
const CartItem = require("../../model/CartItem")

const getCartItems = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId
    const { page, limit } = req.query

    const count = await CartItem.countDocuments({ userId: currentUserId })
    if (!count) {
        return sendResponse(res, 200, true, { cartItems: [], totalPages: 0, count }, null, "Get list cartItems failed")
    }

    const totalPages = Math.ceil(count / limit)
    const offset = limit * (page - 1)

    const cartItems = await CartItem.find({ userId: currentUserId })
        .sort({ createdAt: - 1 })
        .limit(limit).skip(offset)
        .populate({
            path: 'productItemId',
            populate: {
                path: 'productId',
            },
        }).exec()


    sendResponse(res, 200, true, { cartItems, totalPages, count }, null, "Get list cartItems success")
})

module.exports = getCartItems;