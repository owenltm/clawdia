# Clawdia

## Overview
A comprehensive crab inventory and management system designed to track and manage crab inventory, storage boxes, and related operations through a RESTful API.

## Features
- Track crab inventory with detailed information
- Manage storage boxes with fill status tracking
- Monitor crab lifecycle (in/sold/dead)
- RESTful API for all operations
- AI-powered features for data analysis

## Tech Stack
- **Runtime**: Node.js with TypeScript
- **Database**: MySQL with Drizzle ORM
- **API**: Express.js
- **AI Integration**: Google AI SDK
- **Package Manager**: Bun
- **Linting/Formatting**: ESLint, Prettier

## Getting Started
1. Clone the repository
2. Install dependencies: `bun install`
3. Set up environment variables (see Environment Variables section)
4. Run database migrations: `bun run db:generate && bun run db:migrate`
5. Start the development server: `bun run dev`

## Project Structure
```
src/
├── agent/          # AI agent implementations
│   ├── agents/     # Agent definitions
│   └── tools/      # Tools for agents
├── api/            # API routes and controllers
├── db/             # Database schema and client
├── modules/        # Feature modules
│   ├── boxes/      # Box management
│   └── crabs/      # Crab management
└── index.ts        # Application entry point
```

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=
GOOGLE_GENERATIVE_AI_API_KEY=
PORT=3000
```

## Development
- Run in development mode: `bun run dev`
- Generate database migrations: `bun run db:generate`
- Apply migrations: `bun run db:migrate`
- Format code: `bun run format`
- Lint code: `bun run lint`

## Deployment
1. Set up production environment variables
2. Build the application: `bun run build`
3. Start the production server: `bun start`
4. Set up process manager (PM2, systemd, etc.) for production
