import { LOCATION_TYPES } from '@/constant/location';
import location from '@/models/Location';
import { Request, Response } from 'express';

export const addNewLocation = async (req: Request, res: Response) => {
  const foundedLocation = await location.findOne({ type: LOCATION_TYPES.DEFAULT }).lean();
  if (!foundedLocation) {
    req.body.type = LOCATION_TYPES.DEFAULT;
  }
  const address = await location.create(req.body);
  return address;
};

export const getAllLocations = async (req: Request, res: Response) => {
  const addresses = await location.find({}).lean();
  return addresses;
};
