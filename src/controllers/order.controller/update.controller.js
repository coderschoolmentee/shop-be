const { catchAsync, AppError, sendResponse } = require("../../helpers/utils");
const Order = require("../../model/Order");
const User = require("../../model/User");

const updateOrder = catchAsync(async (req, res) => {
    // Get data from request
    const { address, status } = req.body;
    const { id } = req.params;
    const currentUserId = req.userId;

    // Process
    const user = await User.findById(currentUserId);
    if (!user) throw new AppError(404, "User not found", "Update order failed");

    if (user.roles !== "admin") throw new AppError(403, "You not allowed to access", "Update order failed");

    let order = await Order.findById(id);
    if (!order) throw new AppError(404, "Order not found", "Update order failed");

    order = await Order.findByIdAndUpdate(id, { address, status }, { new: true })

    // Response
    sendResponse(res, 200, true, order, null, "Update order successfully");
});

module.exports = updateOrder;