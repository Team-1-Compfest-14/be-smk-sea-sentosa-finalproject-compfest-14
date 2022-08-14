import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { courseService } from '../services/course.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import { courseIdSchema, courseSchema } from '../validations/course.validate';

class CourseController {

    async addNewCourse(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const body = validate(req, courseSchema, 'body');

        await courseService.addNewCourse(userPayload!, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a course'
        });
    }

    async getProposedCourse(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');

        const proposedCourse = await courseService.getNewCourses(userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: { proposedCourse },
            message: 'Successfully get all proposed course'
        });
    }

    async getCourseDetail(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const body = validate(req, courseIdSchema, 'params');

        const course = await courseService.getSpecifyCourse(userPayload!, body);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: { course },
            message: 'Successfully get verified course details'
        });
    }

    async getVerifiedCourses(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');

        const courses = await courseService.getCourses(userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: { courses },
            message: 'Successfully get all verified course'
        });
    }

}

export const courseController = new CourseController();