# Sustainify (Eco-Quest) - Make Your Business Sustainable

Sustainify is a full-stack MERN web application that helps small businesses reduce their carbon footprint and become more sustainable. Track emissions, save costs, and make environmentally conscious decisions with simple, easy-to-use tools.

## What's Included

This is a **production-ready full-stack application** with:

- **Complete User Authentication System**
  - Email/password registration and login
  - JWT-based authentication
  - Password hashing with bcrypt
  - Protected routes and middleware
  - User session management

- **Frontend Features**
  - Beautiful, responsive UI with React + TypeScript
  - Modern UI components (shadcn/ui)
  - Sign In / Sign Up pages with form validation
  - Toast notifications for user feedback
  - Loading states and error handling

- **Backend API**
  - RESTful API with Express.js
  - MongoDB Atlas integration for data persistence
  - Secure authentication endpoints
  - Health check endpoints

- **DevOps Ready**
  - Full Docker support (frontend + backend)
  - Docker Compose for one-command deployment
  - Production-ready nginx configuration
  - Environment-based configuration

- **Additional Features**
  - Carbon footprint tracking interface
  - Sustainability insights
  - Cost-saving analysis tools
  - Responsive design for all devices

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite
- shadcn/ui (Radix UI primitives)
- Tailwind CSS
- React Router DOM
- React Hook Form with Zod validation
- Recharts

**Backend:**
- Node.js with Express
- MongoDB Atlas
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- TypeScript

## Table of Contents

- [Quick Start for Developers](#quick-start-for-developers)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Running with Docker](#running-with-docker)
- [Local Development](#local-development-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- **Docker & Docker Compose** (recommended for quick setup)
- **Node.js** 20.x or higher and npm (for local development)
- **MongoDB Atlas account** (free tier available - setup instructions below)
- **Git** for cloning the repository

## Quick Start for Developers

Follow these steps to get the application running on your machine:

### Option 1: Docker (Easiest - Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/chris320211/eco-quest.git
cd eco-quest

# 2. Set up environment variables
cp .env.example .env

# 3. Edit .env and add your MongoDB Atlas connection string
# See "MongoDB Atlas Setup" section below for detailed instructions
nano .env  # or use your preferred editor

# 4. Start the entire application (frontend + backend)
docker-compose up -d

# 5. Access the application
# Frontend: http://localhost:9900
# Backend API: http://localhost:5001
```

### Option 2: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/chris320211/eco-quest.git
cd eco-quest

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Edit .env and add your MongoDB Atlas connection string
# See "MongoDB Atlas Setup" section below
nano .env  # or use your preferred editor

# 5. Run both frontend and backend
npm run dev:all

# OR run them separately in different terminals:
# Terminal 1:
npm run dev        # Frontend at http://localhost:5173 or http://localhost:8080

# Terminal 2:
npm run server     # Backend at http://localhost:5000
```

### Testing the Application

Once running, you can:

1. **Visit the frontend**: http://localhost:9900 (Docker) or http://localhost:5173 (local)
2. **Click "Sign Up"** to create a new account
3. **Sign in** with your credentials
4. **Test the API directly**:
   ```bash
   # Check backend health (Docker: port 5001, Local: port 5000)
   curl http://localhost:5001/api/health  # Docker
   # or
   curl http://localhost:5000/api/health  # Local development
   ```

### What You'll Need

To fully run this application, you need a **MongoDB Atlas connection string**. Follow the setup guide below to get one (takes ~5 minutes, completely free).

## MongoDB Atlas Setup

### Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or sign in
3. Click "Build a Database"
4. Choose the **FREE** tier (M0 Sandbox)
5. Select your cloud provider and region
6. Click "Create Cluster"

### Step 2: Create a Database User

1. In your Atlas dashboard, go to **Database Access**
2. Click "Add New Database User"
3. Choose **Password** authentication
4. Create a username and strong password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### Step 3: Configure Network Access

1. Go to **Network Access** in the sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict this to specific IPs
4. Click "Confirm"

### Step 4: Get Your Connection String

1. Go to **Database** in the sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user's password
6. Replace `username` with your database username
7. Optionally add a database name before the `?` like: `/sustainify?retryWrites=true&w=majority`

### Step 5: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/sustainify?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-random-string-here
   JWT_EXPIRE=7d
   PORT=5000
   CLIENT_URL=http://localhost:9900
   VITE_API_URL=http://localhost:5001/api  # Use 5001 for Docker, 5000 for local development
   ```

3. **Important**: Never commit the `.env` file to version control!

## Running with Docker

Docker provides the easiest way to run both frontend and backend with a single command.

### Prerequisites for Docker

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- MongoDB Atlas connection string configured in `.env` file

### Docker Commands

**Start the application:**
```bash
docker-compose up -d
```

This will:
- Build the frontend container (React app with nginx)
- Build the backend container (Node.js Express server)
- Start both containers
- Set up networking between them

**View logs:**
```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend
```

**Stop the application:**
```bash
docker-compose down
```

**Rebuild after code changes:**
```bash
docker-compose up -d --build
```

**Check service status:**
```bash
docker-compose ps
```

### Docker Architecture

The `docker-compose.yml` sets up:
- **backend** service: Accessible on port 5001 (internal port 5000)
- **frontend** service: Runs on port 9900
- Shared network for service communication
- Health checks for both services
- Auto-restart on failure

## Local Development Setup

If you prefer to run the application locally without Docker:

### 1. Set up MongoDB Atlas and configure `.env` file (see above)

### 2. Install dependencies

```bash
npm install
```

### 3. Run both frontend and backend

To run both frontend and backend simultaneously:

```bash
npm run dev:all
```

Or run them separately in different terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

The application will be available at:
- **Frontend**: [http://localhost:5173](http://localhost:5173) (development) or [http://localhost:8080](http://localhost:8080)
- **Backend**: [http://localhost:5000](http://localhost:5000)

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start frontend development server with hot reload
- `npm run server` - Start backend API server
- `npm run dev:all` - Run both frontend and backend simultaneously
- `npm run build` - Build production-ready application
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
eco-quest/
├── public/                 # Static assets
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...            # Custom components (Navbar, Hero, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and API client
│   │   ├── api.ts         # API helper functions
│   │   └── utils.ts       # Utility functions
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Home page
│   │   ├── SignIn.tsx     # Sign in page
│   │   ├── SignUp.tsx     # Sign up page
│   │   └── NotFound.tsx   # 404 page
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── server/                # Backend source code
│   ├── config/            # Configuration files
│   │   └── database.ts    # MongoDB connection
│   ├── controllers/       # Route controllers
│   │   └── authController.ts  # Authentication logic
│   ├── middleware/        # Express middleware
│   │   └── auth.ts        # JWT authentication middleware
│   ├── models/            # MongoDB models
│   │   └── User.ts        # User model with password hashing
│   ├── routes/            # API routes
│   │   └── auth.ts        # Authentication routes
│   └── index.ts           # Express server entry point
├── Dockerfile             # Frontend Docker configuration
├── Dockerfile.server      # Backend Docker configuration
├── docker-compose.yml     # Docker Compose for full stack
├── nginx.conf             # Nginx server configuration
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ email, password, name? }`
  - Returns: `{ success, token, user }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ success, token, user }`

- `GET /api/auth/me` - Get current user (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success, user }`

### Health Check

- `GET /api/health` - Check if the backend server is running
  - Returns: `{ status: "OK", message: "Server is running" }`

## Configuration

### Environment Variables

Create a `.env` file in the root directory if you need to configure environment-specific variables:

```env
# Add your environment variables here
# VITE_API_URL=https://api.example.com
```

Note: Environment variables in Vite must be prefixed with `VITE_` to be exposed to the application.

### Port Configuration

To change the port when using Docker Compose, edit the `docker-compose.yml` file:

```yaml
ports:
  - "YOUR_PORT:80"  # Change YOUR_PORT to your desired port
```

## Health Check

The Docker container includes a health check endpoint. You can verify the application is running:

```bash
curl http://localhost:9900/health
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "MONGODB_URI is not defined"**
```bash
# Solution: Make sure you have a .env file with your MongoDB connection string
cp .env.example .env
# Edit .env and add your MongoDB Atlas connection string
```

**Error: "MongoServerError: bad auth"**
- Check that your MongoDB username and password are correct
- Make sure you replaced `<password>` in the connection string with your actual password
- Verify the user exists in MongoDB Atlas Database Access

**Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
- Verify your IP address is whitelisted in MongoDB Atlas Network Access
- Try adding 0.0.0.0/0 (allow from anywhere) for testing
- Check your internet connection

### Docker Issues

**Docker build fails**
```bash
# Clear Docker cache and rebuild
docker system prune -f
docker-compose up -d --build
```

**Port already in use**
```bash
# Check what's using the port
lsof -i :9900  # Frontend
lsof -i :5001  # Backend (Docker)
lsof -i :5000  # Backend (Local) - Note: macOS may use 5000 for AirPlay

# Kill the process or change ports in docker-compose.yml
# Edit the ports section:
ports:
  - "NEW_PORT:80"  # Change NEW_PORT to an available port
```

**Container keeps restarting**
```bash
# Check container logs for errors
docker-compose logs backend
docker-compose logs frontend

# Common cause: Missing or invalid MONGODB_URI in .env
```

### Local Development Issues

**"Cannot find module" errors**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Backend not connecting to frontend**
- Check that `VITE_API_URL` in `.env` points to the correct port:
  - Docker: `http://localhost:5001/api`
  - Local development: `http://localhost:5000/api`
- Verify backend is running:
  - Docker: `curl http://localhost:5001/api/health`
  - Local: `curl http://localhost:5000/api/health`
- Check CORS settings in `server/index.ts`

**Frontend build fails**
```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm install
npm run build
```

### Authentication Issues

**"Not authorized" errors**
- JWT token may have expired (default: 7 days)
- Clear localStorage and sign in again
- Check JWT_SECRET matches in `.env` on both client and server

**Sign up/Sign in not working**
- Check browser console for errors (F12)
- Verify backend is running and accessible
- Test API directly:
  ```bash
  # Docker (port 5001)
  curl -X POST http://localhost:5001/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}'
  
  # Local development (port 5000)
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}'
  ```

### General Debugging

**Check if services are running**
```bash
# Docker
docker-compose ps

# Local (check processes)
lsof -i :5001  # Backend (Docker)
lsof -i :5000  # Backend (Local) - Note: macOS may use 5000 for AirPlay
lsof -i :5173  # Frontend (dev server)
lsof -i :8080  # Frontend (alternate port)
```

**View all logs**
```bash
# Docker
docker-compose logs -f

# Local - check terminal outputs where you ran npm commands
```

**Reset everything**
```bash
# Docker - complete reset
docker-compose down -v
docker system prune -a -f
rm .env
cp .env.example .env
# Edit .env with your MongoDB URI
docker-compose up -d --build

# Local - complete reset
rm -rf node_modules dist .env
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev:all
```

### Still Having Issues?

1. Check the [GitHub Issues](https://github.com/chris320211/eco-quest/issues)
2. Make sure all prerequisites are installed correctly
3. Verify your MongoDB Atlas cluster is running
4. Try the health check endpoints:
   - Backend (Docker): http://localhost:5001/api/health
   - Backend (Local): http://localhost:5000/api/health
   - Frontend: http://localhost:9900/health (Docker) or check if page loads

## For Developers

### Why This Project is Great for Learning

This project demonstrates:

✅ **Full-stack MERN architecture** (MongoDB, Express, React, Node.js)
✅ **Modern TypeScript** throughout frontend and backend
✅ **Production-ready authentication** with JWT and bcrypt
✅ **Docker containerization** for easy deployment
✅ **RESTful API design** with proper error handling
✅ **React best practices** with hooks and modern patterns
✅ **Shadcn/UI component library** integration
✅ **Environment-based configuration** for dev/prod
✅ **Database modeling** with Mongoose
✅ **Security best practices** (password hashing, JWT, CORS)

### Development Workflow

1. Make changes to the code
2. If running with Docker: `docker-compose up -d --build`
3. If running locally: Changes auto-reload with hot module replacement
4. Test your changes
5. Commit and push

### Useful Development Commands

```bash
# Frontend only
npm run dev

# Backend only
npm run server

# Both simultaneously
npm run dev:all

# Build for production
npm run build

# Check for linting issues
npm run lint

# Preview production build
npm run preview
```

## Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Test your changes before submitting
- Update documentation if needed
- Keep PRs focused on a single feature/fix

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
