import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { approvalService } from '../services/approval.service';
import { sendResponse } from '../utils/api.util';

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

}

export const approvalController = new ApprovalController();