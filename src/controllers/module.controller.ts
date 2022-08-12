import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { moduleService } from '../services/module.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import {
    lectureSchema, courseIdModuleSchema
} from '../validations/module.validate';

class ModuleController {

    async addLecture(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const body = validate(req, lectureSchema, 'body');
        const courseId = validate(req, courseIdModuleSchema, 'params');

        await moduleService.addLecture(userPayload!.userId, courseId, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a lecture.'
        });
    }

}

export const moduleController = new ModuleController();