# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## How this application works

This project is built as a two-part application:

1. `sr-front` is the React/Vite frontend.
   - It renders the customer-facing interface, admin pages, and localization.
   - The UI uses React Router for navigation, Zustand for local store state, and `react-i18next` for translations.
   - Data is fetched from the backend API through service helpers in `src/services/`.

2. `sr-api` is the Laravel backend.
   - It exposes REST API endpoints under `/v1/public` for public data and `/v1/admin` for authenticated admin actions.
   - Public routes include categories, products, orders, shipping zones, and coupon validation.
   - Admin routes are protected by `auth:sanctum` and `admin` middleware.

## How React is connected to Laravel

The React frontend communicates with the Laravel backend over HTTP:

- `sr-front/src/services/api.js` configures the base API client.
- Other client modules such as `src/services/catalog.js`, `src/services/admin.js`, and `src/services/auth.js` call the Laravel API endpoints.
- Public data flows via endpoints like `/v1/public/products`, `/v1/public/categories`, `/v1/public/shipping-zones`, and `/v1/public/coupons/validate`.
- Admin actions use authenticated endpoints under `/v1/admin` for orders, products, coupons, and stats.
- Admin authentication uses Laravel Sanctum, with the frontend maintaining session state and protected routes.

## Project structure

- `sr-front/`
  - `src/App.jsx` and `src/routes/index.jsx` define the React app and route structure.
  - `src/components/` contains shared UI components like `Navbar`, `AdminLayout`, and `ProductCard`.
  - `src/pages/` contains page views such as `Home`, `Catalog`, `Login`, and admin pages.
  - `src/locales/` contains translation JSON files for French, English, and Arabic.

- `sr-api/`
  - `routes/api.php` defines the backend API routes.
  - `app/Http/Controllers/` contains controllers for public and admin API logic.
  - `app/Models/` contains models like `Product`, `Coupon`, `Order`, and `User`.

## React / Laravel integration summary

- React is a client-side app served by Vite in development.
- It consumes Laravel as an API provider, not as a server-side rendered app.
- The backend serves JSON data for the frontend and handles security, data persistence, and business logic.
- This keeps the frontend responsive while the backend remains the source of truth for product, order, and admin data.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
