import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { locationService } from '@/services';
import { Request, Response } from 'express';

export const getAllLocationByUser = asyncHandler(async (req: Request, res: Response) => {
    const locations = await locationService.getAllLocationByUser(req, res);
    return locations;
});
export const updateLocation = asyncHandler(async (req: Request, res: Response) => {
    const locations = await locationService.updateLocation(req, res);
    return locations;
});
export const addNewLocation = asyncHandler(async (req: Request, res: Response) => {
    const locations = await locationService.addNewLocation(req, res);
    return locations;
});
export const deleteLocation = asyncHandler(async (req: Request, res: Response) => {
    const locations = await locationService.deleteLocation(req, res);
    return locations;
});
export const getLocationDetails = asyncHandler(async (req: Request, res: Response) => {
    const locations = await locationService.getLocationDetails(req, res);
    return locations;
});
