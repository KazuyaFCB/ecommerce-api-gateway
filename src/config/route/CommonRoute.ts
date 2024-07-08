import { Router } from 'express';
import authRoutes from '../../auth/route/AuthRoute';

const router = Router();

router.use(authRoutes);

export default router;
