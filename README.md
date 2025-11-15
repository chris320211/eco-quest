# Sustainify - Make Your Business Sustainable

Sustainify is a web application that helps small businesses reduce their carbon footprint and become more sustainable. Track emissions, save costs, and make environmentally conscious decisions with simple, easy-to-use tools.

## Features

- Carbon footprint tracking
- Sustainability insights and recommendations
- Cost-saving analysis
- User-friendly interface built with React and shadcn/ui
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts

## Prerequisites

Before you begin, ensure you have one of the following installed:

- **Docker & Docker Compose** (recommended for quick setup)
- **Node.js** 20.x or higher and npm (for local development)

## Quick Start with Docker

The easiest way to run Sustainify is using Docker:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/eco-quest.git
cd eco-quest
```

### 2. Build and run with Docker Compose

```bash
docker-compose up -d
```

The application will be available at [http://localhost:9900](http://localhost:9900)

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

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready application
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
eco-quest/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   └── ...        # Custom components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # Application entry point
│   └── index.css      # Global styles
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── nginx.conf         # Nginx server configuration
└── package.json       # Dependencies and scripts
```

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
