import Router from 'express';
import { register } from '../controllers/auth.controller';

const router = Router();

router.post('/v1/auth/register/hello', register);

export default router;