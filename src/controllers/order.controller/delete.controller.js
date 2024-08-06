const { catchAsync, AppError, sendResponse } = require("../../helpers/utils");
const Order = require("../../model/Order");
const OrderItem = require("../../model/OrderItem");

const deleteOrder = catchAsync(async (req, res) => {
    // Get data from request
    const { orderId } = req.params;
    const { orderItemsId } = req.body;

    console.log(orderItemsId)

    // Process
    let order = await Order.findById(orderId);
    if (!order) throw new AppError(404, "Order not found", "Delete order failed");
    const orderItem = await OrderItem.findById(orderItemsId)
    if (!orderItem) throw new AppError(404, "OrderItem not found", "Delete order failed");

    await Order.findByIdAndDelete(orderId);
    await OrderItem.findByIdAndDelete(orderItemsId);

    // Response
    sendResponse(res, 204, true, null, null, "Delete order successfully");
});

module.exports = deleteOrder;