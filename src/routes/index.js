var express = require('express');
var router = express.Router();

const authApi = require('./auth.api');
router.use("/auth", authApi)

const userApi = require('./user.api');
router.use("/users", userApi)

const productApi = require('./product.api');
router.use("/products", productApi)

module.exports = router;
