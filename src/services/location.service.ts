import Location from '@/models/location';
import { Request, Response } from 'express';

export const addNewLocation = async (req: Request, res: Response) => {
  const address = await Location.create({ ...req.body });

  return address;
};

export const getAllLocations = async (req: Request, res: Response) => {
  const addresses = await Location.find({}).lean();
  return addresses;
};
