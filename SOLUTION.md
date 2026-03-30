# Retail Shopping App (Full-Stack Take-Home Exercise)

'*Build a full-stack retail shopping experience: a React Native mobile app backed by a NestJS
Backend for Frontend (BFF) API. The domain is a retail cart system with a product catalogue and a
discount engine.*'

### Acceptance Criteria:
As a reviewer, I should be able to:

> Clone the repository and follow SOLUTION.md to run both the BFF and the React Native app.

> Launch the React Native app and, as a customer, browse the pre-seeded product catalogue,
manage a cart, and complete a checkout.

> Observe that a successful checkout in the app updates the BFF's stock levels accordingly.

> Observe that checkout is blocked when required stock is not available, with clear feedback in the
app.

> Observe that stock reservations are released if a cart is inactive for 2 minutes.

## Repository Structure

The application is a monorepo containing both the NestJS BFF API and React Native App.

```
/
├── backend/         ← NestJS BFF API
├── frontend/        ← React Native (Expo) app
├── package.json     ← Root workspace orchestrator
└── SOLUTION.md
```

*npm workspaces* are used to manage both applications from the root.

**Note:** I have chosen a monorepo architecture as both apps can be installed, run and tested with a one terminal command, respectively, from the root.

Whereas, if I had implemented hte application without monorepo tooling, installation, running and testing would require running commands from different working directories.


## Prerequisites
This application requires [Node.js](https://nodejs.org/) and [NPM](https://www.npmjs.com). If using a package manager, the latter ships with the former.

## Installation and Quick start

To run the application,

1. Clone the repository

2. Navigate to the project root directory

### Set up the environment

Both applications require a `.env` file to run.

**Backend:**
In your IDE, navigate to `backend/.env.example`, create a copy in the same directory and rename it to `.env`.

**Frontend:**
In your IDE, navigate to `frontend/.env.example`, create a copy in the same directory and rename it to `.env`.

### Run the NestJS BFF API

3. In terminal, run

    $ `npm i`

    $ `npm run backend`

### Run the React Native (Expo) app

The frontend application has been tested and developed with an iOS simulator. It is recommend to run it on iOS:

**Note:** 
    To run on an iOS/Android device or simulator, first follow [Expo setup instructions](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local)

4. In a new terminal, run

    Web: $ `npm run frontend:web`

    iOS: $ `npm run frontend:ios`

    Android: $ `npm run frontend:android`


## Testing

The applications use [Jest Testing Framework](https://jestjs.io/docs/getting-started) for testing.

To run tests, in the root directory run:

  1. Open a terminal in the root directory, run
  
      $ `npm run test`

## Data Persistence
The product catalogue and discounts are loaded from hardcoded data when the backend starts. `product.service.ts` contains the live product catalogue as a field. This field is mutated, at runtime, as users place orders.

Similarly, `cart.service.ts` contains a single cart as a field. This field is mutated, at runtime, via. the endpoints in `cart.controller.ts`, as the user interacts with the cart.

There is no database; restarting the backend resets all runtime state (cart and stock levels) to their initial seed values.

## Testing Strategy
In the interest of time, I have testing is limited to unit tests (including mocking) for buisness logic.

Specifically, the tests focus on backend and frontend services. Controllers and screens are excluded as they are thin wrappers around already-tested logic.

**Backend:**
Positive and negative cases on the methods in its services.

**Frontend:** 
Positive cases on the methods in its services, with both paths covered for checkout (since it must feedback to user in every scenario).

**Note:**  In a production environment, the test suite would be expanded to include controller tests, snapshot tests, integration tests, and end-to-end (E2E) coverage.

## Reasonable Assumptions

**Single cart** — Since the application requires no authentication and a single actor, the backend maintains one global cart, in-memory, at any time.

**Price snapshotting** — Since no endpoint for updating products is required, the price of each product is constant. Consequently, the price of each cart item is captured at the time of its addition to the cart.

**Task scheduling** — The application uses a cron job, running every 30 seconds, to evaluate the cart expiration. Consequently, the cart could be inactive for, at most, 2 minutes 30 seconds before expiring.

**Stock reservation** — To simulate a failing order due to insufficient stock at the time of checkout (not at the time of adding products to cart), the application allows a greater quantity of a product to be added to cart than is in stock.