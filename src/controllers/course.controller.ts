import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { courseService } from '../services/course.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import { courseIdSchema, courseSchema } from '../validations/course.validate';

class CourseController {

    async addCourse(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const body = validate(req, courseSchema, 'body');

        await courseService.addCourse(userPayload!, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a course'
        });
    }

    async getProposedCourses(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const courses = await courseService.getProposedCourses(userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully found all proposed courses',
            data: { courses }
        });
    }

    async getVerifiedCourse(req: Request, res: Response) {
        const params = validate(req, courseIdSchema, 'params');
        const course = await courseService.getVerifiedCourse(params.courseId);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: { course },
            message: 'Successfully found verified course'
        });
    }

    async getVerifiedCourses(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const courses = await courseService.getVerifiedCourses(userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: { courses },
            message: 'Successfully found all verified course'
        });
    }

    async deleteCourse(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const params = validate(req, courseIdSchema, 'params');

        await courseService.deleteCourse(userPayload!, params.courseId);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully deleted a course'
        });
    }

    async getEnrolledCourses(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const courses = await courseService.getEnrolledCourses(userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully found all enrolled courses',
            data: { courses }
        });
    }

}

export const courseController = new CourseController();