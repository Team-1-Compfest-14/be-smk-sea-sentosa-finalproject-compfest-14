import Router from 'express';
import { approvalController } from '../controllers/approval.controller';
import { authController } from '../controllers/auth.controller';
import { courseController } from '../controllers/course.controller';
import {
    courseEnrollmentController
} from '../controllers/courseEnrollment.controller';
import { lectureController } from '../controllers/lecture.controller';
import { moduleController } from '../controllers/module.controller';
import { quizController } from '../controllers/quiz.controller';

import { userController } from '../controllers/user.controller';
import authenticate from '../middlewares/authenticate.middleware';

const router = Router();

// Auths
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authenticate('REFRESH'), authController.refresh);
router.delete('/auth/logout', authenticate('REFRESH'), authController.logout);

// Users
router.get('/users/profile', authenticate('ACCESS'),
    userController.getUserProfile);

// Users Approvals
router.get('/approval/users', authenticate('ACCESS'),
    userController.getUnverifiedInstructors);
router.post('/approval/users/:userId', authenticate('ACCESS'),
    approvalController.approvalActionForNewInstructor);

// Courses
router.post('/courses', authenticate('ACCESS'), courseController.addCourse);
router.get('/courses/verified', authenticate('ACCESS'),
    courseController.getVerifiedCourses);
router.get('/courses/verified/:courseId', authenticate('ACCESS'),
    courseController.getVerifiedCourse);
router.delete('/courses/:courseId', authenticate('ACCESS'),
    courseController.deleteCourse);
router.get('/courses/enrolled/', authenticate('ACCESS'),
    courseController.getEnrolledCourses);

// Courses approvals
router.get('/approval/courses', authenticate('ACCESS'),
    courseController.getProposedCourses);
router.post('/approval/courses/:courseId', authenticate('ACCESS'),
    approvalController.approvalActionForProposedCourse);

// Course Enrollments
router.post('/courses/:courseId/enrollment', authenticate('ACCESS'),
    courseEnrollmentController.enrollCourse);

// Role Instructor
router.delete('/courses/:courseId/lectures/:lectureId',
    authenticate('ACCESS'),
    moduleController.deleteLecture);
router.get('/courses/instructor/own', authenticate('ACCESS'),
    moduleController.getCoursesInstructor);
router.get('/courses/instructor/own/:courseId', authenticate('ACCESS'),
    moduleController.getCoursesInstructorDetail);
router.get('/courses/dashboard/progress', authenticate('ACCESS'),
    moduleController.getProgressDashboard);
router.delete('/courses/:courseId/quizzes/:quizId', authenticate('ACCESS'),
    quizController.deleteQuiz);
router.get('/courses/instructor/own/:courseId/lectures', authenticate('ACCESS'),
    lectureController.getAllLecturesFromSpecificCourseForInstructor);

// Quizzes
router.post('/courses/:courseId/quizzes', authenticate('ACCESS'),
    quizController.addQuiz);
router.get('/courses/:courseId/quizzes', authenticate('ACCESS'),
    moduleController.getEnrolledCourseQuizzes);
router.post('/courses/:courseId/quizzes/:quizId/questions',
    authenticate('ACCESS'), quizController.addNewQuestion);
router.put('/courses/:courseId/quizzes/:quizId', authenticate('ACCESS'),
    quizController.editQuizName);

// Lectures
router.get('/courses/:courseId/lectures', authenticate('ACCESS'),
    moduleController.getEnrolledLecturesForStudent);

router.post('/courses/:courseId/lectures', authenticate('ACCESS'),
    lectureController.addLecture);
router.put('/courses/:courseId/modules/:moduleId/lectures',
    authenticate('ACCESS'), lectureController.editLectureData);
router.delete('/courses/:courseId/lectures/:lectureId', authenticate('ACCESS'),
    lectureController.deleteLecture);

// Role Instructor and Student
router.get('/courses/:courseId/quizzes/:quizId',
    authenticate('ACCESS'), quizController.ViewAllQuestionsAndOptions);
router.post('/courses/:courseId/quizzes/:quizId/answer',
    authenticate('ACCESS'), quizController.answerQuestion);
router.get('/courses/:courseId/quizzes/:quizId/feedback',
    authenticate('ACCESS'), quizController.answerFeedback);

export default router;