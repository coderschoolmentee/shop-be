const { catchAsync, AppError, sendResponse } = require("../../helpers/utils")
const Product = require("../../model/Product")
const User = require("../../model/User")

const deleteProduct = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId
    const { id } = req.params

    const user = await User.findById(currentUserId)
    if (!user) throw new AppError(404, "User not found", "Product delete failed")
    if (user.roles !== "admin") throw new AppError(403, "You not allowed to access", "Delete failed")

    const product = await Product.findByIdAndDelete(id)
    if (!product) throw new AppError(500, "Server error", "Product delete failed")

    sendResponse(res, 200, true, null, null, "Delete product successfully")
})

module.exports = deleteProduct;