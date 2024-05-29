import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
import config from '@/config/env.config';

const stripe = new Stripe(config.stripeConfig.publicKey);

// create a new order
export const createNewOrder = async (req: Request, res: Response, next: NextFunction) => {};
