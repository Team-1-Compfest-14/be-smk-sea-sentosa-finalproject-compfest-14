import Router from 'express';
import { authController } from '../controllers/auth.controller';
import {
    courseEnrollmentController
} from '../controllers/courseEnrollment.controller';
import authenticate from '../middlewares/authenticate.middleware';

const router = Router();

// Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authenticate('ACCESS'), authController.refresh);

// Course Enrollments
router.post('/course/enroll', authenticate('ACCESS'),
    courseEnrollmentController.enrollNewCourse);

export default router;