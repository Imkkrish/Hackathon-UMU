# India Post AI Delivery System - Frontend

Modern React-based web application for AI-powered delivery post office identification with Google OAuth authentication.

## 🚀 Features

- **Google OAuth 2.0 Authentication** - Secure sign-in for authorized India Post personnel
- **Single Address Matching** - Upload parcel images or enter text to find delivery offices
- **Batch Processing** - Process thousands of addresses via CSV upload
- **Interactive Dashboard** - Real-time stats and quick access to tools
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Built with React 19, Tailwind CSS, and smooth animations

## 📋 Pages

1. **Home (/)** - Public landing page with product overview
2. **Login (/login)** - Google OAuth sign-in page
3. **Dashboard (/dashboard)** - Protected main control panel
4. **Address Match (/address-match)** - Protected single address correction
5. **Batch Process (/batch-process)** - Protected bulk processing tool

## 🛠️ Tech Stack

- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Authentication:** Google OAuth 2.0
- **Build Tool:** Vite 7
- **Production Server:** Nginx (in Docker)

## 🔐 Security

### Google OAuth Configuration

- **Client ID:** `372975400843-ffr7c5j59nmga7tk2nbog6o5mjpgq11s.apps.googleusercontent.com`
- **Authorized Origins:** `http://localhost:5173`, `http://localhost:3000`
- **Redirect URIs:** `http://localhost:5173/google-callback`, `http://localhost:3000/google-callback`

### Important Security Notes

⚠️ **NEVER commit the following files:**
- `.env.local` - Contains environment-specific configuration
- `secrets/` folder - Contains OAuth credentials
- Any file with actual API keys or secrets

✅ **Safe to include in frontend:**
- Google Client ID (public identifier)
- API endpoint URLs
- Application configuration

❌ **NEVER include in frontend:**
- Google Client Secret
- Backend API keys
- Database credentials

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration

# Start development server
npm run dev
```

## 🐳 Docker Deployment

```bash
# Build image
docker build \
  --build-arg VITE_GOOGLE_CLIENT_ID=372975400843-ffr7c5j59nmga7tk2nbog6o5mjpgq11s.apps.googleusercontent.com \
  --build-arg VITE_API_BASE_URL=http://localhost:3001 \
  -t india-post-frontend .

# Run container
docker run -p 5173:80 india-post-frontend
```

## 📄 License

India Post Hackathon 2025 - Department of Posts, Government of India

