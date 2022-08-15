import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { moduleService } from '../services/module.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import { courseIdSchema } from '../validations/course.validate';
import {
    addLectureSchema, courseIdModuleSchema, addQuizSchema, deleteLectureSchema
} from '../validations/module.validate';

class ModuleController {

    async addLecture(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const body = validate(req, addLectureSchema, 'body');
        const params = validate(req, courseIdModuleSchema, 'params');

        await moduleService.addLecture(userPayload!.userId,
            params.courseId, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a lecture.'
        });
    }

    async addQuiz(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const body = validate(req, addQuizSchema, 'body');
        const params = validate(req, courseIdModuleSchema, 'params');

        await moduleService.addQuiz(userPayload!.userId,
            params.courseId, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a quiz.'
        });
    }

    async getEnrolledLecturesForStudent(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const params = validate(req, courseIdModuleSchema, 'params');

        const modules = await moduleService
            .getEnrolledLecturesForStudent(userPayload!, params.courseId);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            data: { modules },
            success: true,
            message: 'Successfully get all lecture from course'
        });
    }

    async deleteLecture(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const params = validate(req, deleteLectureSchema, 'params');

        await moduleService.deleteLecture(userPayload!, params);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully deleted a lecture'
        });
    }

    async getCoursesInstructor(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');

        const courses = await moduleService.getCoursesInstructor(userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            data: { courses },
            success: true,
            message: 'Successfully get all course for instructor'
        });
    }

    async getCoursesInstructorDetail(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const params = validate(req, courseIdModuleSchema, 'params');

        const course = await moduleService
            .getCoursesInstructorDetail(userPayload!, params);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            data: { course },
            success: true,
            message: 'Successfully get all course for instructor'
        });
    }

    async getEnrolledCourseQuizzes(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const params = validate(req, courseIdSchema, 'params');

        const quizzes = await moduleService
            .getEnrolledCourseQuizzes(userPayload!, params.courseId);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully found all enrolled course quizzes',
            data: { quizzes }
        });
    }

    async getProgressDashboard(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');

        const dashboardDatas = await moduleService.getProgress(userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: { dashboardDatas },
            message: 'Sucessfully all progress dashboard courses',
        });
    }

}

export const moduleController = new ModuleController();