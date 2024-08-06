const { catchAsync, AppError, sendResponse } = require("../../helpers/utils")
const User = require("../../model/User")

const getCurrentUser = catchAsync(async (req, res, next) => {
    // Get data from request
    const currentUserId = req.userId

    // Business Validate
    const user = await User.findById(currentUserId)
    if (!user) throw new AppError(404, "CurrentUser not found", "Get currentUser failed")

    // Response
    sendResponse(res, 200, true, user, null, "Get currentUser success")
})

module.exports = getCurrentUser;