const orderController = require("../controllers/order.controller");
const authentication = require("../middlewares/authentication");
const { validation } = require("../middlewares/validation");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

/**
 * @route POST /orders
 * @description Create oder
 * @body { totalPrices, status }
 * @access Login required
 */

const createOrderSchema = Joi.object({
  totalPrices: Joi.number().required(),
  status: Joi.string()
    .valid("pending", "accepted", "delivery", "received", "returns", "returned")
    .required(),
});
router.post(
  "/",
  validation(createOrderSchema, "body"),
  authentication.loginRequired,
  orderController.createOrder
);

/**
 * @route GET /orders (admin only)
 * @description Get all oder
 * @query { page, limit, status }
 * @access Login required
 */

const getOrdersSchema = Joi.object({
  page: Joi.number(),
  limit: Joi.number(),
  status: Joi.string().valid(
    "All",
    "pending",
    "accepted",
    "delivery",
    "received",
    "returns",
    "returned"
  ),
});
router.get(
  "/",
  validation(getOrdersSchema, "query"),
  authentication.loginRequired,
  orderController.getOrders
);

/**
 * @route GET /orders/:id
 * @description Get all oder by currenUserId
 * @params { id }
 * @query { page, limit, status }
 * @access Public
 */
const getOrdersByIdSchema = Joi.object({
  id: Joi.objectId().required(),
});

const getOrdersByCurrentUserIdSchema = Joi.object({
  page: Joi.number(),
  limit: Joi.number(),
  status: Joi.string().valid(
    "All",
    "pending",
    "accepted",
    "delivery",
    "received",
    "returns",
    "returned"
  ),
});
router.get(
  "/:id",
  validation(getOrdersByIdSchema, "params"),
  validation(getOrdersByCurrentUserIdSchema, "query"),
  authentication.loginRequired,
  orderController.getOrdersByCurrentUserId
);

/**
 * @route PUT /orders/:id (admin only)
 * @description Get all oder
 * @params { id }
 * @body { address, status }
 * @access Login required
 */

const updateWithIdOrderSchema = Joi.object({
  id: Joi.objectId(),
});

const updateOrderSchema = Joi.object({
  address: Joi.string(),
  status: Joi.string().valid(
    "pending",
    "accepted",
    "delivery",
    "received",
    "returns",
    "returned"
  ),
});
router.put(
  "/:id",
  validation(updateWithIdOrderSchema, "params"),
  validation(updateOrderSchema, "body"),
  authentication.loginRequired,
  orderController.updateOrder
);

/**
 * @route DELETE /orders/:orderId
 * @description Get all oder
 * @params { orderId }
 * @access Login required
 */

const deleteOrderIdOrderSchema = Joi.object({
  orderId: Joi.objectId().required(),
});

router.delete(
  "/:orderId",
  validation(deleteOrderIdOrderSchema, "params"),
  authentication.loginRequired,
  orderController.deleteOrder
);

module.exports = router;
