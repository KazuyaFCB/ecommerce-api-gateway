const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');


router.get('/register', authController.signUp);

module.exports = router;
