# Sustainify (Eco-Quest) - Make Your Business Sustainable

A full-stack MERN web application that helps small businesses track emissions, analyze sustainability data, and make environmentally conscious decisions.

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, shadcn/ui, Tailwind CSS  
**Backend:** Node.js, Express, MongoDB Atlas, JWT authentication

## Prerequisites

- Docker & Docker Compose (recommended) OR Node.js 20.x+ and npm
- MongoDB Atlas account (free tier available)
- Git

## Quick Start

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/chris320211/eco-quest.git
cd eco-quest
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string (see below)
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:9900
- Backend API: http://localhost:5001

### Option 2: Local Development

```bash
git clone https://github.com/chris320211/eco-quest.git
cd eco-quest
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
npm run dev:all
```

**Access:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:6800

## MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user (Database Access → Add New User)
4. Allow network access from anywhere (0.0.0.0/0) for development
5. Get connection string (Database → Connect → Connect your application)
6. Update `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sustainify?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   PORT=6800
   CLIENT_URL=http://localhost:9900
   VITE_API_URL=http://localhost:5001/api  # Docker: 5001, Local: 6800
   ANTHROPIC_API_KEY=your-api-key  # Required for data extraction
   ```

## Docker Commands

```bash
docker-compose up -d          # Start services
docker-compose logs -f        # View logs
docker-compose down           # Stop services
docker-compose up -d --build  # Rebuild and start
```

## Available Scripts

- `npm run dev` - Start frontend dev server (port 8080)
- `npm run server` - Start backend server (port 6800)
- `npm run dev:all` - Run both frontend and backend
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Project Structure

```
eco-quest/
├── src/              # Frontend (React + TypeScript)
├── server/           # Backend (Express + MongoDB)
├── docker-compose.yml
└── package.json
```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/health` - Health check
- `POST /api/uploads` - Upload files
- `GET /api/analysis/dashboard` - Get dashboard data

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

**Container issues:**
- View logs: `docker-compose logs -f`
- Rebuild: `docker-compose up -d --build`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

## License

MIT License
