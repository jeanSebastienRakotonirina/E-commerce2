const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { findById } from '../models/Order';

export async function createCheckoutSession(req, res) {
  const { orderId, currency = 'usd' } = req.body;
  try {
    const order = await findById(orderId).populate('items.productId');
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    const lineItems = order.items.map(item => ({
      price_data: {
        currency,
        product_data: { name: item.productId.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://yourfrontend.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://yourfrontend.com/cart',
      metadata: { orderId: order._id.toString() },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}

export async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await findById(orderId);
    if (order) {
      order.status = 'paid';
      await order.save();
    }
  }

  res.json({ received: true });
}