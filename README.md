# Sustainify - Compliance-First Sustainability Platform

A compliance-first sustainability platform for small businesses that automates carbon footprint tracking, visualizes emissions data, and identifies cost-saving opportunities. Helps businesses stay ahead of environmental regulations without expensive consultants.

## Project Description & Use Case

Small businesses are about to face a wave of environmental regulations by 2030 that they're not ready for. While large corporations have dedicated compliance teams and can afford expensive auditors, small businesses are left scrambling. Sustainify levels the playing field by automating what would normally require consultants and auditors.

**The Problem:** Environmental compliance is expensive and complex. Small businesses can't afford the $10,000+ annual fees that sustainability consultants charge, yet they still need to track emissions, prepare reports, and stay ahead of regulatory changes to avoid costly fines.

**The Solution:** Sustainify automates carbon footprint tracking from uploaded documents (utility bills, sustainability reports, PDFs, spreadsheets). Using AI-powered data extraction, the platform eliminates manual data entry and auditor fees while providing real-time analytics on environmental impact. Businesses get actionable insights to reduce both their carbon footprint and operating costs.

**Use Case:** A small manufacturing business uploads their monthly utility bills and annual sustainability report. Sustainify automatically extracts CO₂ emissions, water usage, energy consumption, and plastic waste data. The platform visualizes trends over time, identifies areas for improvement, and generates compliance-ready reports—all without hiring consultants or spending hours on manual data entry.

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, shadcn/ui, Tailwind CSS, Recharts  
**Backend:** Node.js, Express, MongoDB Atlas, JWT authentication  
**AI:** Claude 3.5 Haiku (Anthropic API) for document data extraction

## Setup & Installation

### Prerequisites

- Docker & Docker Compose (recommended) OR Node.js 20.x+ and npm
- MongoDB Atlas account (free tier available)
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Quick Start

**Option 1: Docker (Recommended)**

```bash
git clone https://github.com/chris320211/eco-quest.git
cd eco-quest
cp .env.example .env
# Edit .env with your credentials (see below)
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:9900
- Backend API: http://localhost:5001

**Option 2: Local Development**

```bash
git clone https://github.com/chris320211/eco-quest.git
cd eco-quest
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev:all
```

**Access:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:6800

### Environment Configuration

Create `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sustainify?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
PORT=6800
CLIENT_URL=http://localhost:9900
VITE_API_URL=http://localhost:5001/api  # Docker: 5001, Local: 6800
ANTHROPIC_API_KEY=your-anthropic-api-key  # Required for AI data extraction
```

**MongoDB Atlas Setup:**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create M0 cluster
3. Create database user (Database Access)
4. Allow network access (0.0.0.0/0 for dev)
5. Get connection string (Database → Connect)

## Challenges Faced & Solutions

**API Integration Issues:** Built flexible parsers that handle inconsistent data formats and gracefully degrade when sources are unavailable.

**AI Prompting & Integration:** Used extensive prompt engineering with Claude 3.5 Haiku to ensure structured, accurate output. Refined prompts combine environmental domain expertise with business context to extract monthly/annual data (CO₂, plastic, water, energy) and generate actionable insights rather than generic responses.

**Feasibility vs. Features:** Prioritized core compliance functionality over ambitious features, focusing on automated tracking and visualization that businesses can use immediately.

**Market Positioning:** Adopted compliance-first approach—businesses care more about avoiding fines and staying ahead of regulations than being "green."

## How We Used Claude API

Sustainify uses **Claude 3.5 Haiku** (via Anthropic API) with extensive prompt engineering to extract sustainability metrics from uploaded documents. The carefully crafted prompts ensure Claude outputs structured monthly/annual data in standardized formats (CO₂ in kg, plastic in lbs, water in gallons, energy in kWh) and generates business-specific insights rather than generic advice.

## Available Scripts

- `npm run dev` - Start frontend dev server (port 8080)
- `npm run server` - Start backend server (port 6800)
- `npm run dev:all` - Run both frontend and backend
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Docker Commands

```bash
docker-compose up -d          # Start services
docker-compose logs -f        # View logs
docker-compose down           # Stop services
docker-compose up -d --build  # Rebuild and start
```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/uploads` - Upload sustainability documents
- `GET /api/analysis/dashboard` - Get dashboard data
- `GET /api/health` - Health check

## Troubleshooting

**MongoDB connection issues:**
- Verify `.env` file exists with `MONGODB_URI`
- Check username/password in connection string
- Ensure IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for dev)

**Port conflicts:**
- Docker: Frontend 9900, Backend 5001
- Local: Frontend 8080, Backend 6800
- Check ports: `lsof -i :PORT` or change in `docker-compose.yml`

**Backend not connecting:**
- Verify `VITE_API_URL` in `.env` matches your setup
- Docker: `http://localhost:5001/api`
- Local: `http://localhost:6800/api`
- Test: `curl http://localhost:PORT/api/health`

**Claude API errors:**
- Verify `ANTHROPIC_API_KEY` is set in `.env`
- Check API key is valid at [Anthropic Console](https://console.anthropic.com/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

## License

MIT License
