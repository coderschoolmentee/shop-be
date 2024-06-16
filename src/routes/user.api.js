const express = require('express');
const router = express.Router();
const Joi = require('joi');
const userController = require('../controllers/user.controller');
const { validation } = require('../middlewares/validation');
const authentication = require('../middlewares/authentication');
Joi.objectId = require("joi-objectid")(Joi);
const { register, update, getCurrentUser, getUsers } = userController

/** 
 * @route GET /users?page=1&limit=10 
 * @description Get users with pagination (admin only)
 * @access Login required
*/

const getUsersSchema = Joi.object({
    limit: Joi.number().default(5),
    page: Joi.number().default(1),
})

router.get('/', validation(getUsersSchema, "query"), authentication.loginRequired, getUsers)

/** 
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
*/
router.get('/me', authentication.loginRequired, getCurrentUser)

/** 
 * @route POST /users
 * @description Register new user
 * @body { name, email, password }
 * @access Public 
*/
const registerSchema = Joi.object({
    name: Joi.string().required().max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    roles: Joi.string().valid("admin", "user").default("user")
})
router.post('/', validation(registerSchema, "body"), register)

/** 
 * @route PUT /users/:id
 * @description Update user profile
 * @body { name, address, avatarUrl, phoneNumber }
 * @access Login required
*/

const checkIdSchema = Joi.object({
    id: Joi.objectId(),
})

const updateUserSchema = Joi.object({
    name: Joi.string().max(30),
    address: Joi.string(),
    avatarUrl: Joi.string(),
    phoneNumber: Joi.string()
})
router.put('/:id',
    validation(updateUserSchema, "body"),
    validation(checkIdSchema, "params"),
    authentication.loginRequired, update)


module.exports = router;    