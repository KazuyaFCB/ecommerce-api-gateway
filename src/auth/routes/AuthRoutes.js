const express = require('express');
const router = express.Router();

///const AuthController2 = require('../controllers/AuthController2');
//import AuthService from '../services/AuthService2';

//const AuthController = require('../controllers/AuthController2');
const AuthController = require('../../../dist/auth/controllers/AuthController2');

//const authController = container.resolve(AuthController);


router.post('/register', (req, res, next) => AuthController.register(req, res, next));
router.post('/login', (req, res, next) => AuthController.login(req, res, next));

// router.post('/register', (req, res) => res.send("hello, world!"));
// router.post('/login', (req, res) => res.send("hello, world!"));

module.exports = router;
