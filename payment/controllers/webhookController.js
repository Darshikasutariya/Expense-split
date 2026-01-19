import { getStripe } from '../config/stripe.js';
import { updatePaymentStatus } from '../services/stripeService.js';
import { publishPaymentCompleted } from '../services/paymentPublisher.js';
import Payment from '../models/Payment.js';

const stripe = getStripe();

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
        await handlePaymentSuccess(paymentIntent);
    }

    return res.status(200).json({ received: true });
};

const handlePaymentSuccess = async (paymentIntent) => {
    try {
        console.log('Payment succeeded:', paymentIntent.id);

        const payment = await Payment.findOne({
            stripePaymentIntentId: paymentIntent.id
        });

        if (!payment) {
            console.warn('Payment not found in DB:', paymentIntent.id);
            return;
        }
        await updatePaymentStatus(payment._id, 'succeeded');
        await publishPaymentCompleted(
            {
                user_id: payment.user_id,
                toUser_id: payment.toUser_id,
                amount: payment.amount,
                group_id: payment.group_id,
                friend_id: payment.friend_id
            },
            {
                data: {
                    paymentId: payment._id,
                    paymentIntentId: paymentIntent.id,
                    status: 'succeeded',
                    amount: payment.amount
                }
            }
        );

        console.log('Payment webhook processed successfully');
    } catch (error) {
        console.error('Error processing payment success webhook:', error.message);
    }
};

export default { stripeWebhook };