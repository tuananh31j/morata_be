/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import config from '@/config/env.config';
import { BadRequestError } from '@/error/customError';
import { ItemOrder } from '@/interfaces/schema/order';
import Order from '@/models/Order';
import { Content } from '@/template/Mailtemplate';
import { sendMail } from '@/utils/sendMail';
import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
import { inventoryService } from '.';
import Cart from '@/models/Cart';

const stripe = new Stripe(config.stripeConfig.secretKey);

// create a new checkout
export const createCheckout = async (req: Request, res: Response, next: NextFunction) => {
    const lineItems = req.body.items.map((item: any) => ({
        price_data: {
            currency: req.body.currency ?? 'usd',
            product_data: {
                name: item.name,
                images: [item.image],
                metadata: {
                    productId: item.productId,
                    productVariationId: item.productVariationId,
                },
            },
            unit_amount: item.price,
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        metadata: { userId: req.userId.toString() },
        phone_number_collection: {
            enabled: true,
        },
        invoice_creation: {
            enabled: true,
        },
        shipping_address_collection: {
            allowed_countries: ['VN'],
        },
        billing_address_collection: 'required',
        mode: 'payment',
        success_url: config.stripeConfig.urlSuccess,
        cancel_url: config.stripeConfig.urlCancel,
    });

    return res.status(200).json({ sessionId: session.id, sessionUrl: session.url });
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
                    productId: product.metadata.productId,
                    productVariationId: product.metadata.productVariationId,
                });
            }
        }

        const dataItems = detailedLineItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.amount_total,
            image: item.image,
            productId: item.productId,
            productVariationId: item.productVariationId,
        })) as ItemOrder[];

        // Check stock before create order
        await inventoryService.checkProductStatus(dataItems);

        // Create a new order
        if (session) {
            const newOrder = new Order({
                userId: session.metadata && session.metadata?.userId, // Assuming you have userId in metadata
                items: dataItems,
                totalPrice: session.amount_total,
                paymentMethod: session.payment_method_types[0],
                shippingAddress: {
                    country: session.customer_details?.address?.country ?? '',
                    province: session.customer_details?.address?.state ?? '',
                    district: '',
                    ward: '',
                    address: session.customer_details?.address?.line1 ?? '',
                },
                customerInfo: {
                    name: session.customer_details?.name,
                    email: session.customer_details?.email,
                    phone: session.customer_details?.phone,
                },
                isPaid: session.payment_status === 'paid',
            });

            await newOrder.save();
            const template: Content = {
                content: {
                    title: 'Đơn hàng mới của bạn',
                    description: 'Bạn vừa mới đặt một đơn hàng từ Morata dưới đây là sản phẩm bạn đã đặt:',
                    email: session.customer_details?.email!,
                },
                product: {
                    items: dataItems,
                    shippingfee: 0,
                    totalPrice: session.amount_total!,
                },
                subject: '[MORATA] - Đơn hàng mới của bạn',
                link: {
                    linkHerf: `${config.clientDomain.url}/my-orders/${newOrder._id}`,
                    linkName: `Kiểm tra đơn hàng`,
                },
                user: {
                    name: session.customer_details?.name!,
                    phone: session.customer_details?.email!,
                    email: session.customer_details?.phone!,
                    address: `[${session.customer_details?.address?.line1}] - ${session.customer_details?.address?.state} , ${session.customer_details?.address?.country}`,
                },
            };
            await inventoryService.updateStockOnCreateOrder(dataItems);
            await sendMail({ email: session.customer_details?.email!, template, type: 'UpdateStatusOrder' });
            await Promise.all(
                dataItems.map(async (product: any) => {
                    await Cart.findOneAndUpdate(
                        { userId: session.metadata && session.metadata?.userId },
                        { $pull: { items: { productVariation: product.productVariationId } } },
                        { new: true },
                    );
                }),
            );
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
