# Structure du projet

```text
ec-frontend/
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ProductCard.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Cart.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ProductForm.jsx
│   │   └── Checkout.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ProductList.jsx
│   │   ├── AddProduct.jsx
│   │   ├── Success.jsx
│   │   └── AdminDashboard.jsx
│   ├── redux/
│   │   ├── store.js
│   │   ├── slices/authSlice.js
│   │   ├── slices/productSlice.js
│   │   ├── slices/cartSlice.js
│   │   ├── slices/orderSlice.js
│   │   └── slices/adminSlice.js
│   ├── services/
│   │   └── api.js
│   ├── tests/
│   │   ├── ProductCard.test.js
│   │   └── AdminDashboard.test.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── setupTests.js
│   └── theme.js
├── public/
├── .env
├── Dockerfile
├── vite.config.js
├── package.json
├── jest.config.js
├── .babelrc
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

```javascript
npm create vite@latest ec-frontend -- --template react
```

## E-commerce Frontend

Description

Frontend React/Vite avec Redux Toolkit, Material UI, et Stripe pour une application e-commerce.

## Installation

Clonez le dépôt: git clone

Installez les dépendances: npm install

Configurez .env (voir .env.example)

Démarrez: npm run dev

## Pages

/: Accueil

/login, /register: Authentification

/products: Liste des produits

/cart: Panier

/success: Confirmation de paiement

/add-product: Ajout de produit

/admin: Tableau de bord admin

## Tests

```javascript
npm test pour React Testing Library
```

Testez responsive avec Chrome DevTools

## Déploiement

Déployez sur Vercel

Configurez les variables d'environnement dans Vercel
