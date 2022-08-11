import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { courseEnrollmentService } from '../services/courseEnrollment.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import {
    courseEnrollmentSchema
} from '../validations/courseEnrollment.validate';

class CourseEnrollmentController {

    async enrollNewCourse(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const courseId = validate(req, courseEnrollmentSchema, 'body');

        await courseEnrollmentService.enrollNewCourse(
            userPayload!, courseId);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully enrolled a new course'
        });
    }

}

export const courseEnrollmentController = new CourseEnrollmentController;