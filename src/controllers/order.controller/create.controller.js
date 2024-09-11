const { catchAsync, AppError, sendResponse } = require("../../helpers/utils");
const CartItem = require("../../model/CartItem");
const Order = require("../../model/Order");
const OrderItem = require("../../model/OrderItem");
const User = require("../../model/User");

const createOrder = catchAsync(async (req, res) => {
  // Get data from request
  const { totalPrices, status } = req.body;
  const currentUserId = req.userId;

  //Business Validation
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(404, "User not found", "Create order failed");
  const address = user.address;
  const phoneNumber = user.phoneNumber;
  if (!address && !phoneNumber)
    throw new AppError(
      404,
      "Address or Phone number not found, please add address or phone number your profile !",
      "Create order failed"
    );
  const cartItem = await CartItem.find({ userId: currentUserId });
  if (!cartItem)
    throw new AppError(404, "CartItem not found", "Create orderItem failed");

  // Process
  const orderCreated = await Order.create({
    userId: currentUserId,
    totalPrices,
    address,
    status,
  });

  // Create order item after create order
  // Create order item with cartItems for currentUser
  cartItem.map(async (element) => {
    await OrderItem.create({
      productItemId: element.productItemId,
      orderId: orderCreated._id,
      quantity: element.quantity,
    });
  });

  if (status) {
    await CartItem.deleteMany({ userId: currentUserId });
  }

  // Response
  sendResponse(
    res,
    201,
    true,
    orderCreated,
    null,
    "Create order and order item successfully"
  );
});

module.exports = createOrder;
