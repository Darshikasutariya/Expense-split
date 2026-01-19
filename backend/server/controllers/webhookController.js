import { getStripe } from '../config/stripe.js';
import Payment from '../models/paymentSchema.js';
import Settlement from '../models/settlementSchema.js';
import Balance from '../models/balanceSchema.js';

let stripe = getStripe();

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Webhook received:', event.type);

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        console.log('Payment succeeded:', {
            id: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            status: paymentIntent.status
        });

        try {
            const payment = await Payment.findOne({
                stripePaymentIntentId: paymentIntent.id
            });

            if (!payment) {
                console.warn('Payment not found in DB:', paymentIntent.id);
                return res.status(200).json({ received: true });
            }

            payment.status = 'succeeded';
            payment.stripePaymentMethodId = paymentIntent.payment_method;

            await payment.save();
            console.log('Payment updated in DB:', payment._id);

            const settlement = await Settlement.create({
                fromUser_id: payment.user_id,
                toUser_id: payment.toUser_id,
                group_id: payment.group_id,
                friend_id: payment.friend_id,
                amount: payment.amount,
                currency: payment.currency,
                payment_id: payment._id,
                paymentMethod: 'online',
                status: 'completed',
                paidAt: new Date()
            });

            console.log('Settlement created:', settlement._id);

            const balanceQuery = payment.group_id
                ? {
                    fromUser_id: payment.user_id,
                    toUser_id: payment.toUser_id,
                    group_id: payment.group_id
                }
                : {
                    fromUser_id: payment.user_id,
                    toUser_id: payment.toUser_id,
                    friend_id: payment.friend_id
                };

            const balance = await Balance.findOne(balanceQuery);

            if (balance) {
                balance.amount = balance.amount - payment.amount;

                if (balance.amount <= 0) {
                    balance.amount = 0;
                    balance.settled = true;
                    balance.settledAt = new Date();
                }

                await balance.save();
                console.log('Balance updated:', balance._id);
            }


        } catch (error) {
            console.error('Error processing payment webhook:', error);
        }
    }
    return res.status(200).json({ received: true });
};