const AuthControllerClass = require('../controllers/auth');
const express = require('express');
const router = express.Router();

const AuthController = new AuthControllerClass;

router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.login);

module.exports = router;