import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { approvalService } from '../services/approval.service';
import { authService } from '../services/auth.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import {
    approvalQuerySchema,
    approvalInstructorSchema,
    approvalCourseSchema,
} from '../validations/approval.validate';

class ApprovalController {

    async approvalActionForNewInstructor(req: Request, res: Response) {
        const params = validate(req, approvalInstructorSchema, 'params');
        const query = validate(req, approvalQuerySchema, 'query');
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');

        const status = await approvalService
            .approveOrRejectInstructor(userPayload!, params, query);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: `Successfully ${status} new instructor`
        });
    }

    async approvalActionForProposedCourse(req: Request, res: Response) {
        const params = validate(req, approvalCourseSchema, 'params');
        const query = validate(req, approvalQuerySchema, 'query');
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');

        const status = await approvalService
            .approveOrRejectProposedCourse(userPayload!, params, query);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: `Successfully ${status} new course`
        });
    }

}

export const approvalController = new ApprovalController();