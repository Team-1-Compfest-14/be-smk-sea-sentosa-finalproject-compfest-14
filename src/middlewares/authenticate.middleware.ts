import type { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import type { TokenType } from '../typings/auth';
import { Errors } from '../utils/error.util';

function authenticate(tokenType: TokenType) {
    return async (req: Request, _: Response, next: NextFunction) => {
        const payload = await authService.getPayload(req, tokenType);
        if (!payload) {
            throw Errors.NO_SESSION;
        }

        req.userPayload = payload;
        return next();
    };
}

export default authenticate;