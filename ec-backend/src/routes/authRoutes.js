const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateInput = require('../middleware/validateInput');

router.post('/register', validateInput(['email', 'password']), authController.register);
router.post('/login', validateInput(['email', 'password']), authController.login);
router.post('/forgot', validateInput(['email']), authController.forgotPassword);
router.post('/reset', validateInput(['token', 'password']), authController.resetPassword);

module.exports = router;