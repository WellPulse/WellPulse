import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://fkvnjfvrbmomerrkqxge.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  const session = event.data.object;

  if (event.type === 'checkout.session.completed') {
    const { company_code, tier } = session.metadata || {};
    if (company_code) {
      await supabase.from('companies')
        .update({ status: 'active', plan: 'paid', tier: tier || 'insights' })
        .eq('code', company_code);
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const sub = await stripe.subscriptions.retrieve(session.subscription);
    const company_code = sub.metadata?.company_code;
    if (company_code) {
      await supabase.from('companies')
        .update({ status: 'paused' })
        .eq('code', company_code);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const company_code = session.metadata?.company_code;
    if (company_code) {
      await supabase.from('companies')
        .update({ status: 'cancelled' })
        .eq('code', company_code);
    }
  }

  res.status(200).json({ received: true });
}
