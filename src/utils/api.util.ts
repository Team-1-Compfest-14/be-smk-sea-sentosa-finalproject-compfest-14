import type { Response } from 'express';
import type { StatusCodes } from 'http-status-codes';

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export interface APIResponse {
    statusCode: StatusCodes;
    success: boolean;
    message: string;
    data?: unknown;
}

export function sendResponse(res: Response, params: APIResponse) {
    const { statusCode, success, ...otherParams } = params;

    const status = success ? 'success' : 'fail';
    const response = { status, ...otherParams };

    return res.status(statusCode).json(response);
}