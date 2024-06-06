import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
import config from '@/config/env.config';
import { BadRequestError } from '@/error/customError';

const stripe = new Stripe(config.stripeConfig.secretKey);

// create a new checkout
export const createCheckout = async (req: Request, res: Response, next: NextFunction) => {
  const lineItems = req.body.items.map((item: any) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: config.stripeConfig.urlSuccess,
    cancel_url: config.stripeConfig.urlCancel,
  });

  return res.status(200).json({ sessionId: session.id, sessionUrl: session.url });
};

export const handleSessionEvents = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const sig: any = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, config.stripeConfig.endpointSecret);
  } catch (err: any) {
    throw new BadRequestError(`Webhook: ${err.message}`);
  }

  console.log('event type:', event.type);

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;

      console.log('paymentIntentSucceeded:', paymentIntentSucceeded);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(200).json({ received: true });
};
