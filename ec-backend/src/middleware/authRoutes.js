
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateInput = require('../middleware/validateInput');

router.post('/register', validateInput, authController.register);
router.post('/login', validateInput, authController.login);
router.post('/forgot', authController.forgotPassword);
router.post('/reset', authController.resetPassword);

module.exports = router;
