import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { sendResponse } from '../utils/api.util';

class UserController {

    async getAllNewInstructor(req: Request, res: Response) {
        const userPayload = await authService.getTokenPayload(req, 'ACCESS');
        const listOfInstructor = await userService
            .getAllNewInstructor(userPayload!);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: listOfInstructor,
            message: 'Successfully get all new Instructor'
        });
    }

}

export const userController = new UserController();