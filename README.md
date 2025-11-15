# Sustainify - Make Your Business Sustainable

Sustainify is a full-stack web application that helps small businesses reduce their carbon footprint and become more sustainable. Track emissions, save costs, and make environmentally conscious decisions with simple, easy-to-use tools.

## Features

- User authentication (Sign in/Sign up)
- Carbon footprint tracking
- Sustainability insights and recommendations
- Cost-saving analysis
- User-friendly interface built with React and shadcn/ui
- Responsive design for desktop and mobile
- Secure MongoDB Atlas database integration

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

## Prerequisites

Before you begin, ensure you have:

- **Docker & Docker Compose** (recommended for quick setup)
- **Node.js** 20.x or higher and npm (for local development)
- **MongoDB Atlas account** (free tier available)

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
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Important**: Never commit the `.env` file to version control!

## Quick Start with Docker

The easiest way to run Sustainify is using Docker:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/eco-quest.git
cd eco-quest
```

### 2. Set up MongoDB Atlas (see above) and configure `.env` file

### 3. Build and run with Docker Compose

```bash
docker-compose up -d
```

The application will be available at:
- **Frontend**: [http://localhost:9900](http://localhost:9900)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### 3. Stop the application

```bash
docker-compose down
```

## Docker Commands

### Build the Docker image manually

```bash
docker build -t eco-quest:latest .
```

### Run the container manually

```bash
docker run -d -p 9900:80 --name eco-quest-app eco-quest:latest
```

### View logs

```bash
docker-compose logs -f
```

### Rebuild after code changes

```bash
docker-compose up -d --build
```

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

### Docker build fails

- Ensure Docker is running and up to date
- Try clearing Docker cache: `docker builder prune`
- Check available disk space

### Port already in use

If port 9900 is already in use, either:
- Stop the service using that port
- Change the port in `docker-compose.yml`

### Application not loading

- Check if the container is running: `docker ps`
- View container logs: `docker-compose logs`
- Verify the health check: `docker inspect eco-quest-app`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
