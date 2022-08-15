import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { approvalService } from '../services/approval.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import { ApprovalSchema } from '../validations/approval.validate';
import { courseIdSchema } from '../validations/course.validate';
import { userIdSchema } from '../validations/user.validate';

class ApprovalController {

    async approvalActionForNewInstructor(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const params = validate(req, userIdSchema, 'params');
        const body = validate(req, ApprovalSchema, 'body');

        const status = await approvalService
            .approveOrRejectInstructor(userPayload!, params, body);
        const statusMsg = status ? 'approved' : 'rejected';

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: `Successfully ${statusMsg} an instructor registration`
        });
    }

    async approvalActionForProposedCourse(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const params = validate(req, courseIdSchema, 'params');
        const body = validate(req, ApprovalSchema, 'body');

        const status = await approvalService
            .approveOrRejectProposedCourse(userPayload!, params, body);
        const statusMsg = status ? 'approved' : 'rejected';

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: `Successfully ${statusMsg} a course proposal`
        });
    }

}

export const approvalController = new ApprovalController();