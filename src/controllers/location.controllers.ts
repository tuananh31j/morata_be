import customResponse from '@/helpers/response';
import { locationService } from '@/services';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getAllLocation = async (req: Request, res: Response) => {
    const locations = await locationService.getAllLocations(req, res);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: locations, message: ReasonPhrases.OK, status: StatusCodes.OK, success: true }));
};

export const addNewLocation = async (req: Request, res: Response) => {
    const locations = await locationService.addNewLocation(req, res);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: locations,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
            success: true,
        }),
    );
};
