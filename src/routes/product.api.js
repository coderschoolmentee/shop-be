const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { validation } = require('../middlewares/validation');
const authentication = require('../middlewares/authentication');
const productController = require('../controllers/product.controller');
Joi.objectId = require("joi-objectid")(Joi);

/** 
 * @route GET /products?page=1&limit=10 
 * @description Get products with pagination
 * @access Login required
*/
const getProductsSchema = Joi.object({
    search: Joi.string(),
    page: Joi.number().default(1),
    limit: Joi.number().default(100),
})

router.get("/",
    validation(getProductsSchema, "query"),
    productController.getProducts)

/** 
 * @route GET /products/:id
 * @description Get single product with id 
 * @access Login required
*/
const productParamsSchema = Joi.object({
    id: Joi.objectId()
})

router.get("/:id",
    validation(productParamsSchema, "params"),
    authentication.loginRequired, productController.getSingleProduct)
/** 
 * @route POST /products/filter?page=1&limit=10
 * @description filter products
 * @body { brand, category, price, size }
 * @access Login required
*/
const productBodySchema = Joi.object({
    brand: Joi.string(),
    category: Joi.string(),
    price: Joi.string(),
    size: Joi.string(),
})

const productQuerySchema = Joi.object({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
})

router.post("/filter",
    validation(productBodySchema, "body"),
    validation(productQuerySchema, "query"),
    authentication.loginRequired, productController.filterProduct)

module.exports = router;    