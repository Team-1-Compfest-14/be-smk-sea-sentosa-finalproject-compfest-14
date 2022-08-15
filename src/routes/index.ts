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
router.get('/users/approval', authenticate('ACCESS'),
    userController.getAllNewInstructor);
router.post('/users/approval/:userId', authenticate('ACCESS'),
    approvalController.approvalActionForNewInstructor);

// Courses
router.post('/courses', authenticate('ACCESS'), courseController.addCourse);
router.get('/courses', authenticate('ACCESS'),
    courseController.getVerifiedCourses);
router.get('/courses/:courseId', authenticate('ACCESS'),
    courseController.getVerifiedCourse);
router.get('/courses/approval', authenticate('ACCESS'),
    courseController.getProposedCourses);
router.post('/courses/approval/:courseId', authenticate('ACCESS'),
    approvalController.approvalActionForProposedCourse);
router.delete('/courses/:courseId', authenticate('ACCESS'),
    courseController.deleteCourse);

// Course Enrollments
router.post('/courses/:courseId/enrollment', authenticate('ACCESS'),
    courseEnrollmentController.enrollNewCourse);

// Course & Modules
// Role Student
router.get('/courses/:courseId/modules/lectures', authenticate('ACCESS'),
    moduleController.getEnrolledLecturesForStudent);

// Role Instructor
router.post('/courses/:courseId/modules/lectures', authenticate('ACCESS'),
    moduleController.addLecture);
router.post('/courses/:courseId/modules/quizzes', authenticate('ACCESS'),
    moduleController.addQuiz);
router.delete('/courses/:courseId/modules/lectures/:lectureId',
    authenticate('ACCESS'),
    moduleController.deleteLecture);
router.get('/courses/instructor/own', authenticate('ACCESS'),
    moduleController.getCoursesInstructor);
router.get('/courses/instructor/own/:courseId', authenticate('ACCESS'),
    moduleController.getCoursesInstructorDetail);
router.get('/courses/dashboard/progress', authenticate('ACCESS'),
    moduleController.getProgressDashboard);

// Quizzes
router.get('/courses/:courseId/quizzes', authenticate('ACCESS'),
    moduleController.getEnrolledCourseQuizzes);
router.post('/courses/:courseId/quizzes/:quizId/questions',
    authenticate('ACCESS'), quizController.addNewQuestion);
router.delete('/courses/:courseId/quizzes/:quizId', authenticate('ACCESS'),
    quizController.deleteQuiz);

// Lectures
router.put('/courses/:courseId/modules/:moduleId/lectures',
    authenticate('ACCESS'), lectureController.editLectureData);
router.delete('/courses/:courseId/lectures/:lectureId', authenticate('ACCESS'));

// Role Instructor and Student
router.get('/courses/:courseId/quizzes/:quizId',
    authenticate('ACCESS'), quizController.ViewAllQuestionsAndOptions);
router.post('/courses/:courseId/quizzes/:quizId/answer',
    authenticate('ACCESS'), quizController.answerQuestion);
router.get('/courses/:courseId/quizzes/:quizId/feedback',
    authenticate('ACCESS'), quizController.answerFeedback);

export default router;