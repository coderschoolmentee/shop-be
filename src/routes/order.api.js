const orderController = require('../controllers/order.controller');
const authentication = require('../middlewares/authentication');
const { validation } = require('../middlewares/validation');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);

/** 
 * @route POST /orders
 * @description Create oder
 * @body { productItemId, totalPrices, status }
 * @access Login required
*/
const createOrderSchema = Joi.object({
    productItemId: Joi.array().required(),
    totalPrices: Joi.number().required(),
    status: Joi.string().valid("pending", "accepted", "delivery", "received", "returns", "returned").required(),

})
router.post('/', validation(createOrderSchema, "body"), authentication.loginRequired, orderController.createOrder)

module.exports = router;  