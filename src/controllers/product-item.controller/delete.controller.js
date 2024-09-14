const { catchAsync, AppError, sendResponse } = require("../../helpers/utils");
const ProductItem = require("../../model/ProductItem");
const User = require("../../model/User");

const deleteProductItem = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { id } = req.params;

  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(404, "User not found", "Product delete failed");
  if (user.roles !== "admin")
    throw new AppError(403, "You not allowed to access", "Delete failed");

  const productItem = await ProductItem.findById(id);
  if (!productItem)
    throw new AppError(404, "ProductItem not found", "Delete failed");

  console.log(productItem);

  await ProductItem.deleteOne({ _id: id });

  sendResponse(res, 204, true, null, null, "Delete productItem successfully");
});

module.exports = deleteProductItem;
