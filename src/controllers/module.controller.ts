import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { moduleService } from '../services/module.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import {
    addLectureSchema, courseIdModuleSchema, addQuizSchema
} from '../validations/module.validate';

class ModuleController {

    async addLecture(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const body = validate(req, addLectureSchema, 'body');
        const param = validate(req, courseIdModuleSchema, 'params');

        await moduleService.addLecture(userPayload!.userId,
            param.courseId, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a lecture.'
        });
    }

    async addQuiz(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const body = validate(req, addQuizSchema, 'body');
        const param = validate(req, courseIdModuleSchema, 'params');

        await moduleService.addQuiz(userPayload!.userId,
            param.courseId, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a quiz.'
        });
    }

}

export const moduleController = new ModuleController();