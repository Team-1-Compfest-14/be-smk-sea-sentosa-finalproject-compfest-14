import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { approvalService } from '../services/approval.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import {
    approvalQuerySchema,
    approvalSchema
} from '../validations/approval.validate';

class ApprovalController {

    async getAllNewInstructor(req: Request, res: Response) {
        const listOfInstructor = await approvalService.getAllNewInstructor();

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: listOfInstructor,
            message: 'Successfully get all new Instructor'
        });
    }

    async approvalAction(req: Request, res: Response) {
        const params = validate(req, approvalSchema, 'params');
        const query = validate(req, approvalQuerySchema, 'query');

        const status = await approvalService
            .approveOrRejectInstructor(params, query);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: `Successfully ${status} new instructor`
        });
    }

}

export const approvalController = new ApprovalController();