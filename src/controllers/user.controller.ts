import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { sendResponse } from '../utils/api.util';

class UserController {

    async getUnverifiedInstructors(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const users = await userService
            .getUnverifiedInstructors(userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully found all unverified instructors',
            data: { users }
        });
    }

    async getUserProfile(req: Request, res: Response) {
        const userPayload = req.userPayload;
        const user = await userService.getUserProfile(userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully found user profile',
            data: { user }
        });
    }

}

export const userController = new UserController();