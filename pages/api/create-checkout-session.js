import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Custom Music Video',
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/form?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}?canceled=true`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}