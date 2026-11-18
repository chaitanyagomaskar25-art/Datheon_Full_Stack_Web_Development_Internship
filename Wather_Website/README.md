# SkyCast 🌤️ — Full-Stack MERN Weather Application

SkyCast is a modern, responsive, commercial-grade full-stack MERN weather application designed to deliver real-time atmospheric data, dynamic weather animations, and user personalization with MongoDB persistence.

---

## 🚀 Key Features

- **Real-Time Global Weather Search**: Live temperature, weather condition, feels-like temperature, humidity, dew point, atmospheric pressure, visibility, and dynamic wind compass needle.
- **5-Day Calendar Forecast**: Dynamically computed from OpenWeatherMap 3-hour interval data, grouped by local calendar day using JavaScript `Array.map()`, featuring daily highs/lows, precipitation chances, and atmospheric descriptions.
- **Dynamic Reactive Themes**: Seamlessly updates application backgrounds, gradients, and animated ambient particles (rain droplets, snowfall flakes, floating clouds, sun rays, starry night) based on live weather condition codes and solar dawn/dusk times.
- **Interactive Weather Visualizations**:
  - **360° Rotating Wind Compass Rose** showing cardinal heading (N, NE, E, SE, S, SW, W, NW) and wind gust speeds.
  - **Solar Daylight Transit Arc** tracking the sun's trajectory across the sky based on local sunrise and sunset timestamps.
  - **Metric Units Toggle**: Seamless one-click switching between Celsius (°C) and Fahrenheit (°F).
- **Global City Autocomplete**: Instant search suggestions for major global capitals and cities with keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).
- **GPS Geolocation**: One-click weather lookup using the browser's Geolocation API.
- **User Authentication & Profiles (MongoDB + JWT)**:
  - Secure registration and login with `bcryptjs` password hashing and signed JSON Web Tokens.
  - Profile management allowing users to update their name, email, and password.
- **Personalized Weather Station**:
  - **Saved Favorite Cities**: Add or remove favorite locations linked to user accounts in MongoDB.
  - **Search History**: Track and clear recent weather searches.
- **Production-Grade Security**:
  - OpenWeatherMap API key is **strictly isolated on the backend** and never exposed to client bundles or browser network requests.
  - In-memory 3-minute weather response caching to protect upstream API quota and prevent redundant requests.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite 5
- **Styling**: Tailwind CSS with custom glassmorphism and keyframe animations
- **Icons**: Lucide React
- **HTTP Client**: Axios with automatic JWT interceptors

### Backend
- **Runtime**: Node.js (v18+) & Express.js
- **Database**: MongoDB with Mongoose (v8)
- **Security**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS
- **External API**: OpenWeatherMap API (Current Weather & 5-Day Forecast endpoints)

---

## 📁 Project Architecture

```
Wather_Website/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & status monitoring
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, profile updates
│   │   │   ├── favoriteController.js # Add, list, delete saved favorite cities
│   │   │   ├── historyController.js  # Search history tracking & clearing
│   │   │   └── weatherController.js  # Real OpenWeatherMap queries & caching
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification & optional auth
│   │   │   └── errorHandler.js       # Centralized HTTP and upstream error handler
│   │   ├── models/
│   │   │   ├── Favorite.js           # Favorite schema with compound user indexing
│   │   │   ├── SearchHistory.js      # User search history schema
│   │   │   └── User.js               # User schema with bcrypt pre-save hashing
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth endpoints
│   │   │   ├── favoriteRoutes.js     # /api/favorites endpoints
│   │   │   ├── historyRoutes.js      # /api/history endpoints
│   │   │   └── weatherRoutes.js      # /api/weather endpoints
│   │   ├── services/
│   │   │   └── openWeatherService.js # OpenWeather API client & calendar aggregation
│   │   └── server.js                 # Express application entry point
│   ├── .env.example                  # Environment configuration template
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx         # Sign In & Sign Up glassmorphism modal
│   │   │   ├── CurrentWeather.jsx    # Hero weather card & favorite star
│   │   │   ├── DynamicBackground.jsx # 5 animated weather background themes
│   │   │   ├── FavoritesList.jsx     # Saved locations drawer/grid
│   │   │   ├── ForecastCard.jsx      # Individual day forecast card
│   │   │   ├── ForecastSection.jsx   # 5-day predictive forecast container
│   │   │   ├── HeroSection.jsx       # Landing hero with headline & quick chips
│   │   │   ├── Navbar.jsx            # Brand header, DB pill, units toggle, user menu
│   │   │   ├── ProfileModal.jsx      # User profile update dialog
│   │   │   ├── RecentSearches.jsx    # Clickable recent search chips
│   │   │   ├── SearchBar.jsx         # Global autocomplete search bar
│   │   │   ├── TemperatureToggle.jsx # °C / °F switcher pill
│   │   │   └── WeatherMetrics.jsx    # Wind rose, solar arc, pressure, visibility
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global authentication state & JWT persistence
│   │   ├── services/
│   │   │   └── api.js                # Axios instance with request/response interceptors
│   │   ├── utils/
│   │   │   ├── citySuggestions.js    # Curated global cities dataset
│   │   │   ├── temperature.js        # Temperature unit conversions
│   │   │   └── weatherHelpers.js     # Condition icons, themes & solar calculations
│   │   ├── App.jsx                   # Main dashboard view
│   │   ├── index.css                 # Custom glassmorphic utilities & animations
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── package.json                      # Root workspace scripts
└── README.md
```

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/skycast
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

### Frontend Configuration (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Security Note**: `OPENWEATHER_API_KEY` is loaded exclusively inside the Node.js backend environment. The client application communicates strictly with `http://localhost:5000/api/weather`.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or later
- **MongoDB**: Local MongoDB instance running on port 27017 (or MongoDB Atlas connection string)
- **OpenWeatherMap API Key**: Free tier API key from [OpenWeatherMap](https://openweathermap.org/)

### 2. Installation
Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Running the Application
From the root directory:

```bash
# Terminal 1: Start Backend Server (runs on http://localhost:5000)
npm run dev:backend

# Terminal 2: Start Frontend Dev Server (runs on http://localhost:5173)
npm run dev:frontend
```

### 4. Production Build
```bash
# Build frontend assets into frontend/dist
npm run build:frontend
```

---

## 🔒 API Endpoints Reference

### Weather API (`/api/weather`)
- `GET /api/weather?city=London` — Fetch current weather and 5-day forecast for a city.
- `GET /api/weather/coordinates?lat=51.5074&lon=-0.1278` — Fetch weather by latitude & longitude.

### Authentication API (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`).
- `POST /api/auth/login` — Sign in and receive a signed JWT token.
- `GET /api/auth/profile` — Retrieve current authenticated user profile *(Protected)*.
- `PUT /api/auth/profile` — Update user name, email, or password *(Protected)*.

### Favorites API (`/api/favorites`) *(Protected)*
- `GET /api/favorites` — List all saved favorite cities for the authenticated user.
- `POST /api/favorites` — Save a city to favorites (`cityName`, `country`, `latitude`, `longitude`).
- `DELETE /api/favorites/:id` — Delete a saved favorite city.

### History API (`/api/history`) *(Protected)*
- `GET /api/history` — List recent search history.
- `DELETE /api/history` — Clear search history.
