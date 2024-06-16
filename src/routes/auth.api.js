const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authController = require('../controllers/auth.controller');
const { validation } = require('../middlewares/validation');
Joi.objectId = require("joi-objectid")(Joi);

/** 
 * @route POST /auth/login
 * @description Login with email and password 
 * @body { email, password }
 * @access Public 
*/
const loginSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
})

router.post('/', validation(loginSchema, "body"), authController.loginWithEmail)

module.exports = router;    