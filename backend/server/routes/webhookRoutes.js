import express from 'express';
import { stripeWebhook } from '../controllers/webhookController.js';

const webhookRouter = express.Router();

webhookRouter.post(
    '/stripe',
    express.raw({ type: 'application/json' }),
    stripeWebhook
);

export default webhookRouter;
