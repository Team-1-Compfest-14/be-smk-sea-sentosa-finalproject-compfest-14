import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { courseService } from '../services/course.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import { addCourseSchema } from '../validations/course.validate';

class CourseController {

    async add(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const body = validate(req, addCourseSchema, 'body');

        await courseService.add(userPayload!.userId, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a course'
        });
    }

}

export const courseController = new CourseController();