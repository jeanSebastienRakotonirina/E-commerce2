# Structure du projet

```text
ec-frontend/
├── src/
│   ├── assets/          # Images statiques, etc.
│   ├── components/      # Composants réutilisables
│   │   ├── ProductCard.js
│   │   ├── FilterBar.js
│   │   ├── Cart.js
│   │   ├── ForgotPassword.js
│   │   ├── ProductForm.js
│   │   └── Checkout.js
│   ├── pages/           # Pages principales
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── ProductList.js
│   │   ├── AddProduct.js
│   │   ├── Success.js
│   │   └── AdminDashboard.js  # Ajouté pour dashboard admin
│   ├── redux/           # Gestion d'état (Redux)
│   │   ├── store.js
│   │   ├── slices/authSlice.js
│   │   ├── slices/productSlice.js
│   │   ├── slices/cartSlice.js
│   │   ├── slices/orderSlice.js
│   │   └── slices/adminSlice.js  # Ajouté pour dashboard admin
│   ├── services/        # Appels API (Axios)
│   │   └── api.js
│   ├── tests/           # Tests unitaires (React Testing Library)
│   │   └── ProductCard.test.js  # Exemple de test
│   ├── App.js           # Routing principal
│   ├── index.js         # Entrée React
│   └── theme.js         # Thème Material UI
├── public/              # Fichiers statiques
├── .env                 # Variables d'environnement
├── Dockerfile           # Conteneurisation
├── vite.config.js       # Config Vite
├── package.json         # Dépendances
├── .github/
│   └── workflows/
│       └── ci.yml       # CI/CD GitHub Actions
└── README.md            # Instructions
```
