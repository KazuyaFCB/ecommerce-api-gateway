import { Router } from 'express';
import AuthController from '../controllers/AuthController2';
import container from '../../config/inversify.config';

const router = Router();
const authController = container.resolve(AuthController);

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));

export default router;
