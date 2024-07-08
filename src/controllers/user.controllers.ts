import customResponse from '@/helpers/response';
import { userService } from '@/services';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getUserProfile = async (req: Request, res: Response) => {
  const profileData = await userService.getUserProfile(req, res);
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: profileData, message: ReasonPhrases.OK, status: StatusCodes.OK, success: true }));
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const data = await userService.updateUserProfile(req, res);
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: data, message: ReasonPhrases.OK, status: StatusCodes.OK, success: true }));
};
