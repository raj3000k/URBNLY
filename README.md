# URBNLY Frontend

React + TypeScript + Vite frontend for URBNLY.

## Prerequisites

- Node.js 18+
- Yarn 1.x
- Backend running locally on `http://localhost:5000`

## 1. Clone and install

```bash
git clone <your-frontend-repo-url>
cd URBNLY
yarn install
```

## 2. Configure environment

Create a local env file from the example:

```bash
cp .env.example .env
```

Default frontend env:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If your backend runs on another URL, update `VITE_API_BASE_URL`.

## 3. Run the frontend

```bash
yarn dev
```

Vite will print the local URL, usually:

```text
http://localhost:5173
```

## 4. Build for production

```bash
yarn build
```

## Local full-stack flow

This frontend depends on the backend and database.

Run them in this order:

1. Start PostgreSQL from the backend repo with Docker
2. Start the backend on `http://localhost:5000`
3. Start this frontend with `yarn dev`

## Main features

- Auth flow with login and register
- Premium landing page and app home
- Property search, filters, and sorting
- Wishlist and profile
- Owner dashboard
- Commute-based recommendations
- Roommate matching and social proof

## Related repos

- Frontend: this repo
- Backend: `urbnly-backend`

The backend README explains database setup and Prisma migration steps.
