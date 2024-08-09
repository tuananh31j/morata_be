import { LOCATION_TYPES } from '@/constant/location';
import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Location from '@/models/Location';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const addNewLocation = async (req: Request, res: Response) => {
    const userId = req.userId;
    const locationType = req.body.type;
    const foundedLocation = await Location.findOne({ type: LOCATION_TYPES.DEFAULT, userId });

    if (locationType === LOCATION_TYPES.DEFAULT && foundedLocation) {
        foundedLocation.set({ type: LOCATION_TYPES.SHIPPING_ADDRESS });
        await foundedLocation.save();
    }
    const newAddress = await Location.create({ ...req.body, userId });
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: newAddress,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
export const updateLocation = async (req: Request, res: Response) => {
    const { locationId } = req.params;
    const location = await Location.findByIdAndUpdate(locationId, req.body, { new: true });
    if (!location) throw new NotFoundError('Location not found');

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: location,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
export const deleteLocation = async (req: Request, res: Response) => {
    const { locationId } = req.params;
    const foundedLocation = await Location.findByIdAndDelete(locationId).lean();
    if (!foundedLocation) throw new NotFoundError('Location not found');
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

export const getAllLocationByUser = async (req: Request, res: Response) => {
    const userId = req.userId;
    const addresses = await Location.find({ userId }).lean();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: addresses,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
export const getLocationDetails = async (req: Request, res: Response) => {
    const id = req.params.locationId;
    const address = await Location.findById(id).lean();
    if (!address) throw new NotFoundError('Location not found');
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: address,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
