import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { lectureService } from '../services/lecture.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import { courseIdSchema } from '../validations/course.validate';
import {
    addLectureSchema,
    completeLectureSchema,
    deleteLecturParamsSchema,
    editLectureParamsSchema,
    editLectureSchema,
    modifyLectureOrderParamsSchema,
    modifyLectureOrderSchema,
} from '../validations/lecture.validate';

class LectureController {

    async addLecture(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const body = validate(req, addLectureSchema, 'body');
        const params = validate(req, courseIdSchema, 'params');

        await lectureService.addLecture(userPayload!, params, body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully created a lecture'
        });
    }

    async editLectureData(req: Request, res: Response) {
        const userPayload = await authService.getPayload(req, 'ACCESS');
        const body = await validate(req, editLectureSchema, 'body');
        const params = await validate(req, editLectureParamsSchema, 'params');

        await lectureService.editLecture(userPayload!, body, params);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully edited a lecture'
        });
    }

    async deleteLecture(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const params = validate(req, deleteLecturParamsSchema, 'params');

        await lectureService.deleteLecture(userPayload!,
            params.courseId, params.lectureId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully deleted a lecture'
        });
    }

    async getAllLecturesFromSpecificCourseForInstructor(
        req: Request, res: Response) {

        const userPayload = req.userPayload;
        const params = validate(req, courseIdSchema, 'params');

        const lectures = await lectureService
            .getAllLecturesFromSpecificCourseForInstructor(
                userPayload!, params);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully found all lectures from specific course',
            data: { lectures }
        });
    }

    async completeLecture(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const params = validate(req, completeLectureSchema, 'params');

        await lectureService.completeLectureModule(userPayload!, params);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully completed a lecture'
        });
    }

    async modifyLectureOrder(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const params = validate(req, modifyLectureOrderParamsSchema, 'params');
        const body = validate(req, modifyLectureOrderSchema, 'body');

        await lectureService.modifyLectureOrder(userPayload!, params, body);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully reorder all lectures'
        });
    }

}

export const lectureController = new LectureController();