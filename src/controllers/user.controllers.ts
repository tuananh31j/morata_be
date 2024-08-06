import customResponse from '@/helpers/response';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { userService } from '@/services';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get: getUserProfile
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const profileData = await userService.getUserProfile(req, res);
    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: profileData, message: ReasonPhrases.OK, status: StatusCodes.OK, success: true }));
});

// @Get: getAllUsers
export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await userService.getAllUsers(req, res, next);
});

// @Get: getUserDetails
export const getUserDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await userService.getUserDetails(req, res, next);
});
// @Post: createUser
export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await userService.createUser(req, res, next);
});
// @Patch: updateUser
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await userService.updateUser(req, res, next);
});
// @Patch: updateUserProfile
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.updateUserProfile(req, res);
    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: data, message: ReasonPhrases.OK, status: StatusCodes.OK, success: true }));
});
