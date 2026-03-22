# Project Context — CSE682 Food Inventory Management System

## What This Is
A Household Food Inventory Management System for CSE 682 (Software Engineering) at Syracuse University. Web app that tracks food items, expiration dates, grocery spending, generates shopping lists, and suggests recipes based on available inventory.

## Tech Stack
- **Frontend:** React 18 + Vite (port 5173), React Router, Bootstrap 5, Axios
- **Backend:** Node.js + Express (port 3000), nodemon for dev
- **Database:** PostgreSQL 16 (running locally in Docker on port 5433)
- **Auth:** JWT-based authentication (bcrypt for passwords)

## Infrastructure
- Hosted on a Mac Mini M4 (16GB RAM, 256GB SSD) at home
- Docker Desktop for containerized services
- Cloudflare Tunnel for public access (no ports exposed)
- Domain: `aipoweredtrainings.com` — this project will use subdomain (e.g., `foodinventory.aipoweredtrainings.com`)
- The Next.js site (aipoweredtrainings.com) also runs on this machine on port 3000, so when Dockerizing this app, the backend needs a different port

## Local Database Setup
Railway trial expired. Database now runs locally in Docker:
```bash
docker run -d \
  --name food-inventory-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=<set in .env> \
  -e POSTGRES_DB=foodinventory \
  -p 5433:5432 \
  --restart always \
  postgres:16-alpine
```

Schema and seed data loaded from:
- `database/schema.sql`
- `database/seed.sql`

## Environment Variables (backend/.env)
```
PGHOST=localhost
PGPORT=5433
PGUSER=postgres
PGPASSWORD=<check .env file>
PGDATABASE=foodinventory
PORT=3000
NODE_ENV=development
JWT_SECRET=<check .env file>
```

## Important Notes
- `backend/src/config/database.js` — SSL is disabled for local dev (`NODE_ENV=development`), enabled for production. This was changed from the Railway config which required SSL.
- The `.env` file is gitignored (intentionally).
- Schema and seed SQL files are in the `database/` directory.
- Frontend makes API calls to the backend on port 3000.

## Running Locally
Terminal 1 (Backend):
```bash
cd backend && npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend && npm run dev
```

Access at: http://localhost:5173

## Still TODO
- Dockerize the app (Dockerfile + docker-compose)
- Set up subdomain via Cloudflare Tunnel config
- The SRS (CSE682_SystemRequirementsSpec_Midterm.docx) defines full requirements including: food inventory CRUD, recipe recommendations, historical inventory review, shopping list generation, expiration tracking
- Not all system features from the SRS are implemented yet

## Repo
https://github.com/duquedd2/CSE682-Food-Inventory-Management-Project

## Other Services on This Machine
- n8n (automation platform) — Docker on port 5678 with its own Postgres
- Cloudflare Tunnel (daemon) — routes aipoweredtrainings.com to port 3000
- AIPTPlatform (Next.js app) — port 3000 (conflicts with this backend when both run)
