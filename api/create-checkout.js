import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  insights: 'price_1TTwoAFtp9gRD2Wdkglug2QE',
  optimize: 'price_1TTwuvFtp9gRD2WdryifJc6Q',
  transform: 'price_1TTwyWFtp9gRD2Wdg4g9rtmM',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tier, quantity, company_code, company_name, email } = req.body;

  if (!tier || !quantity || !company_code || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const priceId = PRICE_IDS[tier];
  if (!priceId) {
    return res.status(400).json({ error: 'Invalid tier' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: priceId,
        quantity: parseInt(quantity),
      }],
      customer_email: email,
      metadata: {
        company_code,
        company_name: company_name || '',
        tier,
        quantity: quantity.toString(),
      },
      subscription_data: {
        metadata: {
          company_code,
          tier,
        }
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://getwellpulse.com'}/success?session_id={CHECKOUT_SESSION_ID}&company=${company_code}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://getwellpulse.com'}`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
}
