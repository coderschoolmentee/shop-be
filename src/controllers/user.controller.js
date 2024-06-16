const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const User = require("../model/User");
const bcrypt = require("bcryptjs");

const userController = {}

userController.register = catchAsync(async (req, res, next) => {
    // Get data from request
    let { name, email, password, roles } = req.body

    // Business Validate
    let user = await User.findOne({ email })
    if (user) throw new AppError(409, "Email have in database", "Register failed")

    // Process
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password, roles });
    if (!user) throw new AppError(500, "Sever nothing to register", "Register failed")
    const accessToken = await user.generateToken();

    // Response
    sendResponse(res, 201, true, { data: user, accessToken }, null, "Create registration")
})

userController.update = catchAsync(async (req, res, next) => {
    // Get data from request
    const currentUserId = req.userId
    const { id } = req.params
    const { name, address, avatarUrl, phoneNumber } = req.body

    // Business Validate
    let user = await User.findById(id)
    if (!user) throw new AppError(404, "User not found", "Update failed")
    if (!user._id.equals(currentUserId)) throw new AppError(400, "The id request not equals currentUserId", "Update failed")

    // Process
    user = await User.findByIdAndUpdate(id, { name, address, avatarUrl, phoneNumber }, { new: true })

    // Response
    sendResponse(res, 200, true, { data: user }, null, "Update success")
})

userController.getCurrentUser = catchAsync(async (req, res, next) => {
    // Get data from request
    const currentUserId = req.userId

    // Business Validate
    const user = await User.findById(currentUserId)
    if (!user) throw new AppError(404, "CurrentUser not found", "Get currentUser failed")

    // Process

    // Response
    sendResponse(res, 200, true, { data: user }, null, "Get currentUser success")
})

userController.getUsers = catchAsync(async (req, res, next) => {
    // Get data from request
    const currentUserId = req.userId
    const { page, limit } = req.query

    // Business Validate
    const admin = await User.findById(currentUserId)
    if (!admin) throw new AppError(404, "User not found", "Get users failed")
    if (admin.roles !== "admin") throw new AppError(403, "You not allowed to access", "Get users failed")

    // Process
    const filterConditions = [{ isDeleted: false }, { roles: "user" }]
    const filterCriterial = filterConditions.length ? { $and: filterConditions } : {};

    const countUser = await User.countDocuments(filterCriterial)
    const totalPages = Math.ceil(countUser / limit)
    const offset = limit * (page - 1)

    const users = await User.find(filterCriterial).sort({ createdAt: -1 }).skip(offset).limit(limit)

    // Response
    sendResponse(res, 200, true, { data: users, totalPages, countUser }, null, "Get Users Success")
})

module.exports = userController;