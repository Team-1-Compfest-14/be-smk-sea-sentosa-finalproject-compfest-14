import Router from 'express';
import { approvalController } from '../controllers/approval.controller';
import { authController } from '../controllers/auth.controller';
import { courseController } from '../controllers/course.controller';
import {
    courseEnrollmentController
} from '../controllers/courseEnrollment.controller';
import { moduleController } from '../controllers/module.controller';
import authenticate from '../middlewares/authenticate.middleware';

const router = Router();

// Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authenticate('REFRESH'), authController.refresh);
router.delete('/auth/logout', authenticate('REFRESH'), authController.logout);

// Course Enrollments
router.post('/courses/:courseId/enroll', authenticate('ACCESS'),
    courseEnrollmentController.enrollNewCourse);

// Course
router.post('/courses', authenticate('ACCESS'), courseController.add);
router.get('/courses/proposed', authenticate('ACCESS'),
    courseController.getProposedCourse);
router.post('/courses/:courseId/modules/lectures', authenticate('ACCESS'),
    moduleController.addLecture);

// Approval
router.get('/approval/register', authenticate('ACCESS'),
    approvalController.getAllNewInstructor);
router.post('/approval/:userId', authenticate('ACCESS'),
    approvalController.approvalAction);

export default router;