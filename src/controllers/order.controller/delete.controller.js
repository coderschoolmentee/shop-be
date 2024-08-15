const { catchAsync, AppError, sendResponse } = require("../../helpers/utils");
const Order = require("../../model/Order");
const OrderItem = require("../../model/OrderItem");

const deleteOrder = catchAsync(async (req, res) => {
    // Get data from request
    const { orderId } = req.params;

    // Process
    await Order.findByIdAndDelete(orderId);
    await OrderItem.deleteMany({orderId});

    // Response
    sendResponse(res, 204, true, null, null, "Delete order successfully");
});

module.exports = deleteOrder;