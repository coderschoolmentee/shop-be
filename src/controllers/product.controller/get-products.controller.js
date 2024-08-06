const { catchAsync, AppError, sendResponse } = require("../../helpers/utils")
const Product = require("../../model/Product")

const getProducts = catchAsync(async (req, res, next) => {
    // Get data from request
    const { page, limit, search } = req.query;

    // Process
    let filterConditions = [];
    if (search !== "All") {
        // { $regex: search, $options: "i" }
        const value = { name: search };
        filterConditions.push(value);
    }
    const filterCriterial = filterConditions.length ? { $and: filterConditions } : {};

    const count = await Product.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);


    const products = await Product.find(filterCriterial)
        .limit(limit)
        .skip(offset)
        .populate("productItems")
        .exec();
    console.log(filterConditions);

    // Response
    sendResponse(res, 200, true, { products, totalPages, count }, null, "Get products successfully");
})

module.exports = getProducts;