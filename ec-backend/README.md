# Structure du projet Backend

```text
ec-backend/
├── src/
│   ├── config/          # Configurations (DB connection)
│   │   └── db.js
│   ├── controllers/     # Logique métier (business logic)
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── adminController.js  # Ajouté pour dashboard admin
│   ├── models/          # Schémas MongoDB (data models)
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/          # Routes API (endpoints)
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js  # Ajouté pour dashboard admin
│   ├── middleware/      # Middlewares (auth, validation, upload)
│   │   ├── authMiddleware.js
│   │   ├── validateInput.js
│   │   ├── uploadMiddleware.js
│   │   └── adminMiddleware.js  # Ajouté pour dashboard admin
│   ├── utils/           # Utilitaires (email, logger)
│   │   ├── email.js
│   │   └── logger.js  # Ajouté pour logs Winston
│   ├── tests/           # Tests unitaires (Jest)
│   │   └── auth.test.js  # Exemple de test
│   └── app.js           # Point d'entrée (entry point)
├── .env                 # Variables d'environnement
├── Dockerfile           # Conteneurisation
├── docker-compose.yml   # Dev local avec MongoDB
├── package.json         # Dépendances
├── .github/
│   └── workflows/
│       └── ci.yml       # CI/CD GitHub Actions
└── README.md            # Instructions

```
