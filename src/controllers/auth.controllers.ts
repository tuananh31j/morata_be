import config from '@/config/env.config';
import customResponse from '@/helpers/response';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { authService } from '@/services';
import { generateAuthTokens } from '@/services/token.service';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Register
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await authService.register(req, res, next);
});

// @Login
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.login(req, res, next);
    const { refreshToken, accessToken } = await generateAuthTokens(user);

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: config.env === 'production' ? true : false,
        maxAge: config.cookie.maxAge,
    });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: { user, accessToken: accessToken },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});

// @Logout
export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await authService.logout(req, res, next);
});

// @Refresh Token
export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = await authService.refresh(req, res, next);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: data,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
});
