import Router from 'express';
import { approvalController } from '../controllers/approval.controller';
import { authController } from '../controllers/auth.controller';


const router = Router();

router.post('/v1/auth/register', authController.register);

router.get('/v1/approval/register', approvalController.getAllNewInstructor);

export default router;