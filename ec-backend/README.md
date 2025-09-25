# Structure du projet Backend

```text
ec-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── validateInput.js
│   │   ├── uploadMiddleware.js
│   │   └── adminMiddleware.js
│   ├── utils/
│   │   ├── email.js
│   │   └── logger.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── admin.test.js
│   └── app.js
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

## E-commerce Backend

Description

Backend pour une application e-commerce sécurisée avec Node.js, Express, MongoDB, Stripe, et Vercel Blob.

Installation

Clonez le dépôt: git clone

Installez les dépendances: npm install

Configurez .env (voir .env.example)

Lancez MongoDB via Docker: docker-compose up -d

Démarrez: npm start

## Endpoints

Auth: /api/auth/register, /api/auth/login, /api/auth/forgot, /api/auth/reset

Produits: /api/products

Panier: /api/cart

Commandes: /api/orders

Paiement: /api/payment/create-checkout-session, /api/payment/webhook

Admin: /api/admin/users, /api/admin/orders

## Tests

```javascript
npm test pour Jest/Supertest
```

Utilisez Postman pour tester les endpoints

Déploiement

Hébergez sur Vercel/Heroku

Configurez MongoDB Atlas

Ajoutez les variables d'environnement dans le dashboard du service
