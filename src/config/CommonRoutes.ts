import { Router } from 'express';
import authRoutes from '../auth/routes/AuthRoutes2';

const router = Router();

router.use(authRoutes);

export default router;
