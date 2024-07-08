import express from 'express';
import AuthController from '../controller/AuthController';
import container from '../../config/ioc/InversifyConfig';

const router = express.Router();
const authController = container.resolve(AuthController);

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));

router.use('/v1/api/auth', router);

export default router;
