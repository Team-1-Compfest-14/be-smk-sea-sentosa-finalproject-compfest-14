import Router from 'express';
import { approvalController } from '../controllers/approval.controller';
import { authController } from '../controllers/auth.controller';
import { courseController } from '../controllers/course.controller';
import {
    courseEnrollmentController
} from '../controllers/courseEnrollment.controller';
import { moduleController } from '../controllers/module.controller';
import { userController } from '../controllers/user.controller';
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
router.get('/courses', authenticate('ACCESS'),
    courseController.getVerifiedCourses);
router.get('/courses/:courseId', authenticate('ACCESS'),
    courseController.getCourseDetail);
router.post('/courses', authenticate('ACCESS'), courseController.add);
router.post('/courses/:courseId/modules/lectures', authenticate('ACCESS'),
    moduleController.addLecture);
router.post('/courses/:courseId/modules/quizzes', authenticate('ACCESS'),
    moduleController.addQuiz);

// Approval
router.get('/approval/register', authenticate('ACCESS'),
    userController.getAllNewInstructor);
router.post('/approval/:userId', authenticate('ACCESS'),
    approvalController.approvalActionForNewInstructor);
router.get('/approval/course', authenticate('ACCESS'),
    courseController.getProposedCourse);
router.post('/approval/course/:courseId', authenticate('ACCESS'),
    approvalController.approvalActionForProposedCourse);


export default router;