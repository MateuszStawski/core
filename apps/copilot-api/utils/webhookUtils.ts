import { NextFunction } from 'express';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { AlchemyWebhookEvent } from '../types';
import { eventCache } from '../services/scheduler';

export function validateAlchemySignature(
  getSigningKey: (internalWebhookId: string) => Promise<string | undefined>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const rawBody = (req as any).rawBody as string;
    const signature = (req as any).signature as string | undefined;
    const internalWebhookId = req.params.internalWebhookId;

    if (!signature) {
      res.status(400).send('Invalid request: missing raw body or signature');
      return;
    }

    const signingKey = await getSigningKey(internalWebhookId);
    if (!signingKey) {
      res
        .status(403)
        .send(`No signing key found for webhookId: ${internalWebhookId}`);
      return;
    }

    if (!isValidSignatureForStringBody(rawBody, signature, signingKey)) {
      res.status(403).send('Signature validation failed, unauthorized!');
    } else {
      next();
    }
  };
}

function isValidSignatureForStringBody(
  body: string,
  signature: string,
  signingKey: string,
): boolean {
  const hmac = crypto.createHmac('sha256', signingKey);
  hmac.update(body, 'utf8');
  const digest = hmac.digest('hex');
  return signature === digest;
}

// Handle incoming events and add them to the cache
export async function handleIncomingEvent(
  webhookEvent: AlchemyWebhookEvent,
): Promise<void> {
  const activities = webhookEvent.event.activity;
  if (!activities || activities.length === 0) {
    console.error('No activity found in the webhook event.');
    return;
  }

  for (const activity of activities) {
    if (!activity.hash) {
      console.error('Transaction hash is missing in an activity.', activity);
      continue;
    }
    const txHash = activity.hash;
    if (!eventCache[txHash]) {
      eventCache[txHash] = {
        activities: [],
        timestamp: Date.now(),
      };
    }
    activity.network = webhookEvent.event.network?.replace('_MAINNET', '');
    eventCache[txHash].activities.push(activity);
  }
}
