import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { approvalService } from '../services/approval.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import { approvalSchema } from '../validations/approval.validate';

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
        const body = validate(req, approvalSchema, 'body');
        const query = req.query;

        await approvalService.approveOrRejectInstructor(body, query);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully get all new Instructor'
        });
    }

}

export const approvalController = new ApprovalController();