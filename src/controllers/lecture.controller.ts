import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { lectureService } from '../services/lecture.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import {
    editLectureParamsSchema, editLectureSchema
} from '../validations/lecture.validate';

class LectureController {

    async editLectureData(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const body = await validate(req, editLectureSchema, 'body');
        const params = await validate(req, editLectureParamsSchema, 'params');

        await lectureService.editLecture(userPayload!, body, params);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully edited a lecture'
        });
    }

}

export const lectureController = new LectureController();