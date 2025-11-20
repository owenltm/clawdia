# Clawdia

## Overview
A comprehensive crab inventory and management system designed to track and manage crab inventory, storage boxes, financial records, and related operations through a RESTful API with AI-powered agents.

## Features
- **Inventory Management**: Track crab inventory with detailed information and storage box management
- **Financial Tracking**: Record and manage revenue and expenses
- **AI Agents**: Three specialized AI agents powered by Mastra and Google AI
  - Clawdia Agent: General-purpose assistant
  - Finance Agent: Financial operations and tracking
  - Inventory Agent: Inventory operations and queries
- **Authentication**: JWT-based authentication with refresh tokens using Passport.js
- **History Logging**: Comprehensive activity tracking across all operations
- **RESTful API**: Express.js API with organized controllers and middleware

## Tech Stack
- **Runtime**: Bun with TypeScript
- **Framework**: Express.js v5
- **Database**: MySQL with Drizzle ORM
- **AI Integration**: Mastra Core + Google AI SDK
- **Authentication**: Passport.js with JWT and Local strategies
- **Security**: bcryptjs for password hashing
- **Validation**: Zod schemas

## Getting Started
1. Clone the repository
2. Install dependencies: `bun install`
3. Set up environment variables (see Environment Variables section)
4. Run database migrations: `bun run db:generate && bun run db:migrate`
5. Start the development server: `bun run dev`

## Project Structure
```
src/
├── agent/               # AI agent implementations (Mastra)
│   ├── agents/          # ClawdiaAgent, FinanceAgent, InventoryAgent
│   └── tools/           # Agent tools (finances, stocks)
├── api/                 # API routes and controllers
│   ├── agent/           # Agent controller
│   └── core/            # Auth, Box, Crab, Finance, Inventory controllers
├── db/                  # Database schema and client
├── errors/              # Custom error classes
├── middleware/          # Auth and Passport middleware
├── modules/             # Feature modules
│   ├── auth/            # User authentication and refresh tokens
│   ├── finance/         # Finance journal management
│   ├── history/         # Activity history logging
│   └── inventory/       # Box and crab management
└── index.ts             # Application entry point
```

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=mysql://user:password@localhost:3306/clawdia
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
PORT=3000
API_KEY=your_api_key_for_agent_endpoints (optional)
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

## Development
- Run in development mode: `bun run dev`
- Start production server: `bun start`
- Generate database migrations: `bun run db:generate`
- Apply migrations: `bun run db:migrate`
- Regenerate last migration: `bun run db:regenerate-last`

## API Endpoints
- `/` - Health check endpoint
- `/agent/*` - AI agent endpoints (requires API_KEY if configured)
- `/core/auth/*` - Authentication endpoints (login, register, refresh)
- `/core/boxes/*` - Box management endpoints
- `/core/crabs/*` - Crab inventory endpoints
- `/core/finance/*` - Financial tracking endpoints
- `/core/inventory/*` - Inventory operations endpoints

## Deployment
1. Set up production environment variables
2. Run database migrations: `bun run db:migrate`
3. Start the production server: `bun start`
4. Set up process manager (PM2, systemd, etc.) for production
5. Configure reverse proxy (nginx, caddy) for HTTPS
