import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { courseEnrollmentService } from '../services/courseEnrollment.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import { courseIdSchema } from '../validations/course.validate';

class CourseEnrollmentController {

    async enrollCourse(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const params = validate(req, courseIdSchema, 'params');

        await courseEnrollmentService.enrollCourse(
            params, userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully enrolled a new course.'
        });
    }

}

export const courseEnrollmentController = new CourseEnrollmentController();