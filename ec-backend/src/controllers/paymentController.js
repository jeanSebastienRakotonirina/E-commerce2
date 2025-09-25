const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const Order = require('../models/Order');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not defined in environment variables');
}

exports.createCheckoutSession = async (req, res) => {
  const { orderId, currency = 'usd' } = req.body;
  try {
    const order = await Order.findById(orderId).populate('items.productId');
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
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cart',
      metadata: { orderId: order._id.toString() },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await Order.findById(orderId);
    if (order) {
      order.status = 'paid';
      await order.save();
    }
  }

  res.json({ received: true });
};