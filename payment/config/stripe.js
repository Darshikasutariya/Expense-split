import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

let stripe;

export const getStripe = () => {
    if (!stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            console.log("Stripe API key missing", process.env.STRIPE_SECRET_KEY);
            throw new Error("Stripe API key missing");
        }

        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
};
