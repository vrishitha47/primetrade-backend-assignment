const express = require('express');

const { getMe, login, register } = require('../controllers/authController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const { loginValidation, registerValidation } = require('../validations/authValidation');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);

module.exports = router;
