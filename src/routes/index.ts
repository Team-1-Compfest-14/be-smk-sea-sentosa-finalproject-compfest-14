import Router from 'express';
import { authController } from '../controllers/auth.controller';
import authenticate from '../middlewares/authenticate.middleware';

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authenticate('REFRESH'), authController.refresh);
router.delete('/auth/logout', authenticate('REFRESH'), authController.logout);

export default router;