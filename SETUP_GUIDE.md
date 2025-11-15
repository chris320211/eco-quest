# Eco-Quest Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecoquest

# JWT Secret - Use a strong random string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# JWT Expiration
JWT_EXPIRE=7d

# Server Port
PORT=6800

# Client URL (for CORS)
CLIENT_URL=http://localhost:8080

# Vite API URL (for frontend)
VITE_API_URL=http://localhost:6800/api

# Anthropic API Key (for Claude Haiku analysis)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Get Your API Keys

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Replace `<username>`, `<password>`, and `<cluster>` in MONGODB_URI

#### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste into ANTHROPIC_API_KEY

### 4. Start Development Servers

Run both frontend and backend:

```bash
npm run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Frontend (Vite)
npm run dev

# Terminal 2 - Backend (Express)
npm run server
```

### 5. Access the Application

Open your browser to:
- Frontend: [http://localhost:8080](http://localhost:8080)
- Backend API: [http://localhost:6800](http://localhost:6800)

## Features

### User Authentication
- Register new account
- Login with email/password
- JWT-based authentication
- Protected routes

### Document Upload & Analysis
- Upload PDFs, images, or PowerPoint files
- Automatic text extraction
- Claude Haiku AI analysis
- Extract monthly sustainability metrics:
  - CO₂ emissions (kg)
  - Plastic waste (lbs)
  - Water usage (gallons)
  - Energy usage (kWh)

### Data Visualization
- Dashboard with key metrics
- Upload history tracking
- Analysis reports
- CSV export functionality

## Project Structure

```
eco-quest/
├── server/                  # Backend (Express + TypeScript)
│   ├── controllers/        # Request handlers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth, validation
│   ├── services/          # Claude Haiku integration
│   ├── utils/             # File parsing utilities
│   └── index.ts           # Server entry point
├── src/                    # Frontend (React + TypeScript)
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── lib/               # API client, utilities
│   └── main.tsx           # Frontend entry point
├── uploads/               # Uploaded files (gitignored)
├── .env                   # Environment variables (gitignored)
└── package.json           # Dependencies
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Uploads
- `POST /api/uploads` - Upload files
- `GET /api/uploads` - Get upload history
- `DELETE /api/uploads/:id` - Delete upload

### Extractions (Claude Haiku Analysis)
- `GET /api/extractions` - Get all extractions
- `GET /api/extractions/:uploadId` - Get extraction for specific upload
- `GET /api/extractions/:uploadId/export/:type` - Export as CSV (monthly/annual)

### Analysis
- `GET /api/analysis/dashboard` - Get dashboard data
- `GET /api/analysis` - Get analysis by period
- `POST /api/analysis` - Create/update analysis

## Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check connection string format
- Verify database user credentials

### Anthropic API Errors
- Check API key is valid
- Ensure you have credits in your account
- Verify the API key has correct permissions

### File Upload Issues
- Check uploads/ directory exists and is writable
- Verify file size is under 10MB
- Ensure file type is supported (PDF, JPG, PNG, PPTX)

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## Development Scripts

```bash
# Start both frontend and backend
npm run dev:all

# Frontend only (Vite dev server)
npm run dev

# Backend only (Express with hot reload)
npm run server

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Production Deployment

### Build the Application
```bash
npm run build
```

### Environment Variables for Production
Update `.env` with production values:
- Use strong JWT_SECRET
- Set production MongoDB URI
- Set proper CORS CLIENT_URL
- Keep ANTHROPIC_API_KEY secure

### Deploy Backend
- Host on services like Heroku, Railway, Render, or DigitalOcean
- Ensure MongoDB connection is accessible
- Set all environment variables

### Deploy Frontend
- Built files are in `dist/` folder
- Deploy to Vercel, Netlify, or any static host
- Update VITE_API_URL to point to production API

## Testing the Integration

1. Register a new account
2. Login
3. Navigate to Upload page
4. Upload a PDF with sustainability data containing:
   - Monthly dates (e.g., "January 2023")
   - Environmental metrics with units (e.g., "500 kWh", "1200 kg CO2")
5. Wait for processing (status changes to "Processing" → "Processed")
6. Click "View" to see Claude Haiku's analysis
7. Click "CSV" to download extracted data

## Support

For issues or questions:
- Check the [HAIKU_INTEGRATION.md](./HAIKU_INTEGRATION.md) documentation
- Review server logs for error messages
- Verify all environment variables are set correctly

## License

MIT
