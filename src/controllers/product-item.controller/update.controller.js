const { catchAsync, AppError, sendResponse } = require("../../helpers/utils")
const ProductItem = require("../../model/ProductItem")
const User = require("../../model/User")

const updateProductItem = catchAsync(async (req, res, next) => {
    const data = req.body
    const currentUserId = req.userId
    const { id } = req.params

    const user = await User.findById(currentUserId)
    if (!user) throw new AppError(404, "User not found", "Product update failed")
    if (user.roles !== "admin") throw new AppError(403, "You not allowed to access", "Update failed")

    const productItem = await ProductItem.findByIdAndUpdate(id, data, { new: true })

    sendResponse(res, 200, true, productItem, null, "Update product variants successfully")
})

module.exports = updateProductItem;