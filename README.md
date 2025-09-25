# Développement d'une Application E-commerce Sécurisée : Tutoriel Pédagogique avec Planning sur 14 Mois (35h/semaine)

## Introduction

Ce document combine le code de l'application e-commerce sécurisée (authentification, uploads avec Vercel Blob, paiements Stripe, etc.) avec un planning détaillé sur **14 mois**, basé sur une disponibilité de **35 heures par semaine**. Avec 35h/semaine, nous disposons de **2100 heures** (35h × 60 semaines), permettant de compléter les **49 heures** de fonctionnalités essentielles en 2 semaines, mais nous étalons sur 14 sessions (1 par mois, ~35h chacune) pour inclure des améliorations (tests Jest, dashboard admin, CI/CD, etc.), des révisions, et un apprentissage approfondi.

**Objectifs** **Pédagogiques**

- Développer une application full-stack (Node.js/Express backend, React/Vite frontend).

- Intégrer Stripe pour paiements sécurisés, Vercel Blob pour uploads.

- Ajouter tests unitaires, dashboard admin, et CI/CD.

- Étaler sur 14 mois pour assimilation, avec 35h/semaine (10h théorie, 20h codage, 5h tests par session).

- **Début** : 22 octobre 2025 (ajusté depuis 22 septembre 2025).

- **Fin** : ~décembre 2026.

**Estimation** **Totale**

- **Base** : 49h (essentiel : auth, produits, panier, commandes, Stripe, déploiement).

- **Étendue** : 340h (tests, admin, CI/CD, optimisations).

- **Planning** : 14 sessions × 35h = **490h** (sur 2100h disponibles), avec pauses de ~4 semaines entre sessions.

## Planning Détaillé avec Fichiers

Chaque session (1 semaine, 35h) couvre des tâches spécifiques, avec les fichiers associés. Les pauses entre sessions servent à réviser, tester, ou lire les docs (Stripe, Vercel, etc.).

### Mois 1 : Session 1 – Configuration et Modèles Backend (35h)

- **Date** : 20-26 octobre 2025.

- **Tâches** : Setup Node.js/Express, Docker, MongoDB, modèles (User, Product, Cart, Order), auth
basique, tests manuels.

- **Temps** : 5h setup, 10h connexion DB + modèles, 10h auth (register/login), 10h tests.

- **Objectifs** : Bases Node.js, MongoDB. Testez API avec Postman.

- **Fichiers** :

./ec-backend/package.json

```json

{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.3",
    "nodemailer": "^6.9.1",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^7.1.0",
    "multer": "^1.4.5-lts.1",
    "@vercel/blob": "^0.10.0",
    "stripe": "^14.5.0",
    "winston": "^3.8.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.5.0",
    "supertest": "^6.3.0"
  }
}

```

./ec-backend/.env

```text

PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_strong_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
VERCEL_BLOB_TOKEN=your_vercel_blob_read_write_token
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

```

./ec-backend/src/config/db.js

```javascript

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

```

./ec-backend/src/models/User.js

```javascript

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

```

./ec-backend/src/models/Product.js

```javascript

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: 'text' },
  description: { type: String, required: true, index: 'text' },
  price: { type: Number, required: true },
  color: { type: String },
  size: { type: String },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
```

./ec-backend/src/models/Cart.js

```javascript
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);

```

./ec-backend/src/models/Order.js

```javascript

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    price: { type: Number },
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
  stripeSessionId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

```

./ec-backend/src/controllers/authController.js

```javascript

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

```

./ec-backend/src/routes/authRoutes.js

```javascript

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;

```

./ec-backend/src/app.js

```javascript

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

connectDB();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

```

./ec-backend/Dockerfile

```text

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

```

./ec-backend/docker-compose.yml

```text

version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    env_file: .env
    depends_on:
      - mongo
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"

```

- **Pause** : 4 semaines (relisez Mongoose docs, testez localement).

### Mois 2 : Session 2 – Authentification Complète (35h)

- **Date** : 17-23 novembre 2025.

- **Tâches** : Forgot/reset password, middleware auth/validation, emails sécurisés, tests manuels.

- **Temps** : 10h forgot/reset, 10h middleware, 5h emails, 10h tests.

- **Objectifs** : JWT, sécurité. Testez reset via logs.

- **Fichiers** :

./ec-backend/src/controllers/authController.js

```javascript

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const crypto = require('crypto');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `Reset your password: http://yourfrontend.com/reset/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Reset link sent' });
  } catch (err) {
    res.status(500).json({ msg: 'Error sending email' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

```

./ec-backend/src/middleware/authMiddleware.js

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
```

./ec-backend/src/middleware/validateInput.js

```javascript
const validateInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }
  next();
};

module.exports = validateInput;

```

./ec-backend/src/middleware/authRoutes.js

```javascript

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateInput = require('../middleware/validateInput');

router.post('/register', validateInput, authController.register);
router.post('/login', validateInput, authController.login);
router.post('/forgot', authController.forgotPassword);
router.post('/reset', authController.resetPassword);

module.exports = router;

```

- **Pause** : 4 semaines (testez sécurité avec OWASP ZAP).

### Mois 3 : Session 3 – Produits et Uploads (35h)

- **Date** : 15-21 décembre 2025.

- **Tâches** : CRUD produits, filtres textuels, upload Vercel Blob, tests sécurisés.

- **Temps** : 15h CRUD/filtres, 10h upload, 10h tests.

- **Objectifs** : APIs REST, fichiers sécurisés. Testez upload JPEG/PNG.

- **Fichiers** :

./ec-backend/src/controllers/productController.js

```javascript

const Product = require('../models/Product');
const { put } = require('@vercel/blob');

exports.getProducts = async (req, res) => {
  const { name, color, size, description } = req.query;
  let query = {};
  if (name) query.name = { $regex: name, $options: 'i' };
  if (color) query.color = color;
  if (size) query.size = size;
  if (description) query.description = { $regex: description, $options: 'i' };

  try {
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, color, size, stock } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ msg: 'No image uploaded' });

  try {
    const { url } = await put(file.originalname, file.buffer, {
      access: 'public',
      token: process.env.VERCEL_BLOB_TOKEN,
    });

    const product = new Product({ name, description, price, color, size, stock, imageUrl: url });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Upload failed' });
  }
};
```

./ec-backend/src/routes/productRoutes.js

```javascript

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', productController.getProducts);
router.post('/', authMiddleware, upload.single('image'), productController.createProduct);

module.exports = router;
```

./ec-backend/src/middleware/uploadMiddleware.js

```javascript
const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;

```

- **Pause** : 4 semaines (lisez Vercel Blob docs).

### Mois 4 : Session 4 – Panier et Commandes (35h)

- **Date** : 12-18 janvier 2026.

- **Tâches** : Panier (add/get/remove), commandes (create), validation stock, tests.

- **Temps** : 10h panier, 10h commandes, 5h validation, 10h tests.

- **Objectifs** : Relations MongoDB. Testez panier.

- **Fichiers** :

./ec-backend/src/controllers/cartController.js

```javascript

const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
```

./ec-backend/src/controllers/orderController.js

```javascript

const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) return res.status(400).json({ msg: 'Cart empty' });

    let total = 0;
    const items = cart.items.map(item => {
      total += item.productId.price * item.quantity;
      return { productId: item.productId._id, quantity: item.quantity, price: item.productId.price };
    });

    const order = new Order({ userId: req.user.id, items, total });
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
```

./ec-backend/src/routes/cartRoutes.js

```javascript

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, cartController.addToCart);

module.exports = router;
```

./ec-backend/src/routes/orderRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, orderController.createOrder);

module.exports = router;
```

- **Pause** : 4 semaines (testez populate MongoDB).

### Mois 5 : Session 5 – Paiement Stripe (35h)

- **Date** : 9-15 février 2026.
- **Tâches** : Checkout session, webhook, multi-devises, tests Stripe CLI.
- **Temps** : 10h checkout, 10h webhook, 5h multi-devises, 10h tests.
- **Objectifs** : Paiements sécurisés. Testez avec `stripe listen`.
- **Fichiers** :

./ec-backend/src/controllers/payementController.js

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

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
};

exports.handleWebhook = async (req, res) => {
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

    const order = await Order.findById(orderId);
    if (order) {
      order.status = 'paid';
      await order.save();
    }
  }

  res.json({ received: true });
};
```

./ec-backend/src/routes/paymentRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-checkout-session', authMiddleware, paymentController.createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router;
```

./ec-backend/app.js

```javascript
const express = require('express');
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const app = express();

connectDB();

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: 'application/json', limit: '10mb' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

```

- **Pause** : 4 semaines (lisez Stripe docs).

### Mois 6 : Session 6 – Frontend Setup et Redux (35h)

- **Date** : 9-15 mars 2026.
- **Tâches** : Vite/MUI setup, Redux store/slices (auth, product), pages Home/Login/ProductList.
- **Temps** : 5h setup, 15h Redux, 10h pages, 5h tests.
- **Objectifs** : React/Redux. Testez UI-backend.
- **Fichiers** :

./ec-frontend/package.json

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "redux": "^4.2.1",
    "@reduxjs/toolkit": "^1.9.5",
    "react-redux": "^8.1.1",
    "axios": "^1.4.0",
    "@stripe/stripe-js": "^2.1.0",
    "@stripe/react-stripe-js": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.14",
    "@types/react-dom": "^18.2.6",
    "@vitejs/plugin-react": "^4.0.1",
    "vite": "^4.4.0",
    "jest": "^29.5.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.16.5"
  }
}
```

./ec-frontend/.env

```text
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

./ec-frontend/src/theme.js

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  palette: {
    primary: { main: '#1976d2' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
```

./ec-frontend/src/main.jsx

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import store from './redux/store';
import theme from './theme';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
);
```

./ec-frontend/src/App.js

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductList from './pages/ProductList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </Router>
  );
}

export default App;
```

./ec-frontend/src/services/api.js

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;
```

./ec-frontend/src/redux/store.js

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});

export default store;
```

./ec-frontend/src/redux/slices/authSlice.js

```javascript

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', credentials);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: localStorage.getItem('token'), loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.token = action.payload.token; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

./ec-frontend/src/redux/slices/productSlice.js

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getProducts = createAsyncThunk('products/get', async (filters) => {
  const params = new URLSearchParams(filters);
  const res = await api.get(`/products?${params.toString()}`);
  return res.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { list: [], loading: false },
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => { state.list = action.payload; });
  },
});

export default productSlice.reducer;
```

./ec-frontend/src/pages/Home.js

```javascript
import React from 'react';
import { Typography } from '@mui/material';

const Home = () => {
  return <Typography variant="h2">Bienvenue sur l'E-commerce Sécurisé</Typography>;
};

export default Home;
```

./ec-frontend/src/pages/Login.js

```javascript
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(credentials));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField name="email" label="Email" onChange={handleChange} fullWidth />
      <TextField name="password" label="Password" type="password" onChange={handleChange} fullWidth />
      <Button type="submit" variant="contained">Login</Button>
    </Box>
  );
};

export default Login;
```

./ec-frontend/src/pages/ProductList.js

```javascript
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/slices/productSlice';
import { Grid } from '@mui/material';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const dispatch = useDispatch();
  const { list: products } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({ name: '', color: '', size: '', description: '' });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(getProducts(filters));
  }, [filters, dispatch]);

  return (
    <>
      <FilterBar filters={filters} onChange={handleFilterChange} />
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProductList;
```

- **Pause** : 4 semaines (lisez Redux Toolkit).

### Mois 7 : Session 7 – Frontend Composants de Base (35h)

- **Date** : 6-12 avril 2026.
- **Tâches** : Composants ProductCard, FilterBar, Cart, ProductForm, tests UI.
- **Temps** : 15h composants, 10h intégration API, 10h tests responsive.
- **Objectifs** : UI responsive. Testez mobile.
- **Fichiers** :

./ec-frontend/src/components/ProductCard.js

```javascript
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <Card>
      {product.imageUrl && <CardMedia component="img" height="140" image={product.imageUrl} alt={product.name} />}
      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography>{product.description}</Typography>
        <Typography>${product.price}</Typography>
        <Button onClick={handleAdd} variant="contained">Add to Cart</Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
```

./ec-frontend/src/components/FilterBar.js

```javascript
import React from 'react';
import { TextField, Grid } from '@mui/material';

const FilterBar = ({ filters, onChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}><TextField name="name" label="Nom" value={filters.name} onChange={onChange} fullWidth /></Grid>
      <Grid item xs={12} sm={3}><TextField name="color" label="Couleur" value={filters.color} onChange={onChange} fullWidth /></Grid>
      <Grid item xs={12} sm={3}><TextField name="size" label="Taille" value={filters.size} onChange={onChange} fullWidth /></Grid>
      <Grid item xs={12} sm={3}><TextField name="description" label="Description" value={filters.description} onChange={onChange} fullWidth /></Grid>
    </Grid>
  );
};

export default FilterBar;
```

./ec-frontend/src/components/Cart.js

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../redux/slices/cartSlice';
import { List, ListItem, Typography, Button } from '@mui/material';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  return (
    <>
      <List>
        {items.map((item) => (
          <ListItem key={item.productId._id}>
            <Typography>{item.productId.name} x {item.quantity}</Typography>
          </ListItem>
        ))}
      </List>
      <Button variant="contained">Proceed to Checkout</Button>
    </>
  );
};

export default Cart;
```

./ec-frontend/src/components/ProductForm.js

```javascript
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createProduct } from '../redux/slices/productSlice';

const ProductForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', color: '', size: '', stock: '', image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    dispatch(createProduct(data));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField name="name" label="Nom" onChange={handleChange} fullWidth />
      <TextField name="description" label="Description" onChange={handleChange} fullWidth />
      <TextField name="price" label="Prix" type="number" onChange={handleChange} fullWidth />
      <TextField name="color" label="Couleur" onChange={handleChange} fullWidth />
      <TextField name="size" label="Taille" onChange={handleChange} fullWidth />
      <TextField name="stock" label="Stock" type="number" onChange={handleChange} fullWidth />
      <input type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handleChange} />
      <Button type="submit" variant="contained">Ajouter Produit</Button>
    </Box>
  );
};

export default ProductForm;
```

./ec-frontend/src/redux/slices/cartSlice.js

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getCart = createAsyncThunk('cart/get', async () => {
  const res = await api.get('/cart');
  return res.data;
});

export const addToCart = createAsyncThunk('cart/add', async (data) => {
  const res = await api.post('/cart/add', data);
  return res.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.fulfilled, (state, action) => { state.items = action.payload.items; })
      .addCase(addToCart.fulfilled, (state, action) => { state.items = action.payload.items; });
  },
});

export default cartSlice.reducer;
```

- **Pause** : 4 semaines (testez responsive).

### Mois 8 : Session 8 – Frontend Checkout et Paiement (35h)

- **Date** : 4-10 mai 2026.

- **Tâches** : Stripe Elements, pages Register/Success, tests end-to-end.

- **Temps** : 10h Stripe, 5h pages, 10h tests, 10h débogage.

- **Objectifs** : Checkout fluide. Testez paiement test.

- **Fichiers** :

./ec-frontend/src/components/Checkoutjs

```javascript
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = ({ sessionId }) => {
  return (
    <Elements stripe={stripePromise}>
      {/* Custom checkout form if needed */}
    </Elements>
  );
};

export default Checkout;
```

./ec-frontend/src/pages/Registerjs

```javascript
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', credentials);
      dispatch(login(credentials));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField name="email" label="Email" onChange={handleChange} fullWidth />
      <TextField name="password" label="Password" type="password" onChange={handleChange} fullWidth />
      <Button type="submit" variant="contained">Register</Button>
    </Box>
  );
};

export default Register;
```

./ec-frontend/src/pages/Success.js

```javascript
import React from 'react';
import { Typography, Box } from '@mui/material';

const Success = () => {
  return (
    <Box>
      <Typography variant="h4">Paiement Réussi !</Typography>
      <Typography>Votre commande a été confirmée.</Typography>
    </Box>
  );
};

export default Success;
```

./ec-frontend/src/redux/slices/orderSlice.js

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk('orders/create', async () => {
  const res = await api.post('/orders');
  return res.data;
});

export const createCheckoutSession = createAsyncThunk('orders/checkout', async (orderId) => {
  const res = await api.post('/payment/create-checkout-session', { orderId });
  return res.data;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { list: [], sessionId: null, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(createCheckoutSession.fulfilled, (state, action) => { state.sessionId = action.payload.id; });
  },
});

export default orderSlice.reducer;
```

./ec-frontend/src/components/Cartjs

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../redux/slices/cartSlice';
import { createOrder, createCheckoutSession } from '../redux/slices/orderSlice';
import { List, ListItem, Typography, Button } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { sessionId } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleCheckout = async () => {
    const { payload: order } = await dispatch(createOrder());
    const { payload: session } = await dispatch(createCheckoutSession(order._id));
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <>
      <List>
        {items.map((item) => (
          <ListItem key={item.productId._id}>
            <Typography>{item.productId.name} x {item.quantity}</Typography>
          </ListItem>
        ))}
      </List>
      <Button onClick={handleCheckout} variant="contained">Proceed to Checkout</Button>
    </>
  );
};

export default Cart;
```

./ec-frontend/src/App.js

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import Cart from './components/Cart';
import Success from './pages/Success';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
```

- **Pause** : 4 semaines (testez Stripe cards).

### Mois 9 : Session 9 – Tests Unitaires Backend (35h)

- **Date** : 1-7 juin 2026.

- **Tâches** : Tests Jest pour auth, produits, panier, commandes, Stripe.

- **Temps** : 20h tests, 10h débogage, 5h doc.

- **Objectifs** : Couverture 80%+. Lisez Jest.

- **Fichiers** :

./ec-frontend/src/tests/auth.test.js

```javascript

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

- **Pause** : 4 semaines (ajoutez tests manuels).

### Mois 10 : Session 10 – Tests Unitaires Frontend et Accessibilité (35h)

- **Date** : 29 juin-5 juillet 2026.

- **Tâches** : Tests React Testing Library, accessibilité (ARIA, keyboard).

- **Temps** : 15h tests, 10h accessibilité, 10h débogage.

- **Objectifs** : UI robuste. Testez VoiceOver.

- **Fichiers** :

./ec-frontend/src/tests/ProductCard.test.js

```javascript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import ProductCard from '../components/ProductCard';

describe('ProductCard', () => {
  const product = { _id: '1', name: 'Test Product', price: 10, imageUrl: 'test.jpg' };
  it('renders product name', () => {
    render(
      <Provider store={store}>
        <ProductCard product={product} />
      </Provider>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

- **Pause** : 4 semaines (lisez WCAG).

### Mois 11 : Session 11 – Tableau de Bord Admin Backend (35h)

- **Date** : 27 juillet-2 août 2026.

- **Tâches** : Routes admin (users/produits/commandes), middleware admin.

- **Temps** : 15h routes, 10h middleware, 10h tests.

- **Objectifs** : Gestion avancée. Testez rôles.

- **Fichiers** :

./ec-backend/src/controllers/adminController.js

```javascript
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
```

./ec-backend/src/routes/adminRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/users', adminMiddleware, adminController.getUsers);
router.delete('/products/:id', adminMiddleware, adminController.deleteProduct);

module.exports = router;
```

./ec-backend/src/middleware/adminMiddleware.js

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ msg: 'Admin access required' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
```

- **Pause** : 4 semaines (testez RBAC).

### Mois 12 : Session 12 – Tableau de Bord Admin Frontend (35h)

- **Date** : 24-30 août 2026.

- **Tâches** : UI admin (dashboard, CRUD), tests UI.

- **Temps** : 15h UI, 10h API, 10h tests.

- **Objectifs** : Admin fonctionnel. Testez CRUD.

- **Fichiers** :

./ec-frontend/src/pages/AdminDashboard.js

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../redux/slices/adminSlice';
import { Typography, Box } from '@mui/material';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4">Admin Dashboard</Typography>
      {users.map((user) => (
        <Typography key={user._id}>{user.email}</Typography>
      ))}
    </Box>
  );
};

export default AdminDashboard;
```

./ec-frontend/src/redux/slices/adminSlice.js

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getUsers = createAsyncThunk('admin/getUsers', async () => {
  const res = await api.get('/admin/users');
  return res.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: { users: [], loading: false },
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state, action) => { state.users = action.payload; });
  },
});

export default adminSlice.reducer;
```

- **Pause** : 4 semaines (optimisez responsive).

### Mois 13 : Session 13 – CI/CD et Optimisations (35h)

- **Date** : 21-27 septembre 2026.

- **Tâches** : GitHub Actions, logs Winston, indexes DB, tests.

- **Temps** : 10h CI/CD, 10h logs, 10h DB, 5h tests.

- **Objectifs** : Automatisation. Testez pipeline.

- **Fichiers** :

./ec-backend/.github/workflows/ci.yml

```yml
name: CI/CD
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '22' }
      - run: npm install
      - run: npm test
```

./ec-backend/src/utils/logger.js

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
```

- **Pause** : 4 semaines (lisez GitHub Actions).

### Mois 14 : Session 14 – Déploiement et Documentation (35h)

- **Date** : 19-25 octobre 2026.

- **Tâches** : Déploiement Vercel/Render, README, doc API, tests end-to-end.

- **Temps** : 10h déploiement, 15h doc, 10h tests.

- **Objectifs** : Projet live. Testez full-stack.

- **Fichiers** :

./ec-backend/README.md

```md

# E-commerce Sécurisé

Application full-stack avec Node.js, React, MongoDB, Stripe, Vercel Blob.

## Setup

1. Clonez le repo.

2. Backend: `cd backend`, `npm install`, configurez `.env`, `npm start`.

3. Frontend: `cd frontend`, `npm install`, configurez `.env`, `npm run dev`.

4. Testez avec Postman et Stripe CLI.

## Déploiement

- Backend: Render
- Frontend: Vercel
```

./ec-frontend/Dockerfile

```docker
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

./ec-frontend/vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

- **Fin** : Révision novembre-décembre 2026.

## Calcul et Justification

- **Total** : 14 × 35h = **490h** (sur 2100h).

- **Calendrier** : 22 octobre 2025 à 25 octobre 2026 (~12 mois), +2 mois pour révisions/extensions.

- **Espacement** : ~4 semaines/session (13 intervalles × 30 jours ≈ 390 jours).

- **Heures restantes** : 2100h - 490h = **1610h** (pour TypeScript, GraphQL, maintenance).

## Conseils Pédagogiques

- **Hebdo** : 10h docs, 20h codage, 5h tests par session.

- **Git** : Committez quotidiennement.

- **Tests** : Postman, Stripe CLI, Jest. Visez 80% couverture.

- **Ressources** : Docs Stripe, Vercel, MUI. Tutoriels YouTube.

- **Extensions** : Notifications push, analytics, i18n post-projet.
