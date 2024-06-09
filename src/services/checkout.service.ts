import config from '@/config/env.config';
import { BadRequestError } from '@/error/customError';
import { OrderSchema } from '@/interfaces/schema/order';
import Order from '@/models/Order';
import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';

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
    phone_number_collection: {
      enabled: true,
    },
    invoice_creation: {
      enabled: true,
    },
    mode: 'payment',
    success_url: config.stripeConfig.urlSuccess,
    cancel_url: config.stripeConfig.urlCancel,
  });

  // return res.status(200).json({ sessionId: session.id, sessionUrl: session.url });
  return res.redirect(session.url as string);
};

const createOrder = async (session: Stripe.Checkout.Session) => {
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Initialize an array to hold line items with product details
    const detailedLineItems = [];
    // Fetch detailed product information for each line item
    for (const item of lineItems.data) {
      if (item.price && item.price.product) {
        const product = await stripe.products.retrieve(item.price.product as string);
        detailedLineItems.push({
          ...item,
          image: product.images[0],
          name: product.name,
        });
      }
    }

    const dataItems = detailedLineItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.amount_total,
      image: item.image,
    }));

    // Create a new order
    if (session) {
      const newOrder = new Order({
        userId: session.metadata?.userId, // Assuming you have userId in metadata
        items: dataItems,
        totalPrice: session.amount_total,
        paymentMethod: session.payment_method_types[0],
        shippingAddress: session.customer_details?.address,
        customerInfo: {
          name: session.customer_details?.name,
          email: session.customer_details?.email,
          phone: session.customer_details?.phone,
        },
        isPaid: session.payment_status === 'paid',
      });

      await newOrder.save();
    }

    console.log('Order saved successfully');
  } catch (error) {
    console.error('Error processing checkout.session.completed event:', error);
  }
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
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await createOrder(session);
      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object;

      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object;

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(200).json({ received: true });
};
