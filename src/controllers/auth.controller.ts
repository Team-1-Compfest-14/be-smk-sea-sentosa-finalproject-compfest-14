import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';
import { sendResponse } from '../utils/api.util';
import { validate } from '../utils/validate.util';
import { loginSchema, registerSchema } from '../validations/user.validate';

class AuthController {

    async register(req: Request, res: Response) {
        const body = validate(req, registerSchema, 'body');
        await authService.register(body);

        return sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Successfully registered an account'
        });
    }

    async login(req: Request, res: Response) {
        const body = validate(req, loginSchema, 'body');
        const { accessToken, refreshToken } = await authService.login(body);

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Successfully logged in'
        });
    }

}

export const authController = new AuthController();