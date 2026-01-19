import { getStripe } from '../config/stripe.js';
import Payment from '../models/Payment.js';

const stripe = getStripe();

export const processStripePayment = async (paymentData) => {
    try {
        const { user_id, toUser_id, amount, paymentMethod, group_id, friend_id } = paymentData;

        console.log('Processing Stripe payment...');
        console.log('Amount: ₹' + amount);
        console.log('Method:', paymentMethod);

        const stripePaymentMethodId = 'pm_card_visa';
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),// amount in paise
            currency: 'inr',
            automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
            payment_method: stripePaymentMethodId,
            confirm: true,
            metadata: {
                user_id: user_id.toString(),
                toUser_id: toUser_id.toString(),
                group_id: group_id?.toString() || '',
                friend_id: friend_id?.toString() || '',
                appName: 'Splitwise'
            },
            description: `Settlement of ₹${amount}`
        });

        const payment = await Payment.create({
            user_id,
            toUser_id,
            group_id: group_id || null,
            friend_id: friend_id || null,
            amount,
            currency: 'INR',
            paymentMethod,
            stripePaymentIntentId: paymentIntent.id,
            stripePaymentMethodId,
            status: paymentIntent.status
        });

        console.log('Payment processed successfully!');
        console.log('Payment ID:', payment._id);
        console.log('Stripe Payment Intent:', paymentIntent.id);
        console.log('Status:', paymentIntent.status);

        return {
            success: true,
            payment: payment,
            paymentIntent: paymentIntent,
            data: {
                paymentId: payment._id,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
                amount: parseFloat(amount.toFixed(2))
            }
        };

    } catch (error) {
        console.error('Stripe payment error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};


export const getPaymentDetails = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const payment = await Payment.findById(payment_id)
            .populate('user_id', 'name email')
            .populate('toUser_id', 'name email')
            .populate('group_id', 'groupName')
            .populate('settlement_id');


        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }


        const userId = req.user._id.toString();
        if (payment.user_id._id.toString() !== userId && payment.toUser_id._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }


        return res.status(200).json({
            success: true,
            message: "Payment details fetched successfully",
            data: payment
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePaymentStatus = async (paymentId, status) => {
    try {
        await Payment.findByIdAndUpdate(paymentId, { status });
        console.log(`Payment ${paymentId} status updated to ${status}`);
        return true;
    } catch (error) {
        console.error('Error updating payment status:', error.message);
        return false;
    }
};
