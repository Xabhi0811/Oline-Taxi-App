# 🚗 Uber App - Complete Documentation

A full-stack ride-sharing application built with **Node.js/Express** backend and **React/Vite** frontend, featuring real-time location tracking and ride management using WebSocket technology.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Environment Variables](#environment-variables)
6. [Running the Project](#running-the-project)
7. [Project Flow](#project-flow)
8. [API Endpoints](#api-endpoints)
9. [Socket.IO Events](#socketio-events)
10. [Database Schema](#database-schema)
11. [Frontend Components](#frontend-components)
12. [Key Features](#key-features)

---

## 🎯 Project Overview

This Uber-like application is a **two-sided marketplace** that connects:
- **Users**: People looking for rides
- **Captains**: Drivers offering rides

### Core Functionality:
- User and Captain authentication (Register/Login/Logout)
- Real-time ride booking and management
- Live location tracking using Google Maps API
- Fare calculation based on distance
- Real-time communication using WebSocket (Socket.IO)
- Ride confirmation and completion workflow

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB (Mongoose ODM v8.16.1)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt/bcryptjs
- **Real-time**: Socket.IO v4.8.1
- **API Validation**: express-validator
- **CORS**: Enabled for frontend communication
- **Environment**: dotenv for configuration

### Frontend
- **UI Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.3
- **Routing**: React Router v7.6.3
- **Styling**: Tailwind CSS v4.1.11
- **Icons**: Remix Icon v4.6.0
- **Animations**: GSAP v3.13.0
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client v4.8.1
- **CSS**: Custom CSS + Tailwind

---

## 📁 Project Structure

```
uber-app/
├── Backend/                          # Node.js/Express Server
│   ├── app.js                        # Express app setup & routes
│   ├── server.js                     # Server startup & Socket.IO initialization
│   ├── socket.js                     # Socket.IO configuration & event handlers
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables
│   │
│   ├── controllers/                  # Business logic
│   │   ├── user.controller.js        # User registration, login, logout, profile
│   │   ├── captain.controller.js     # Captain registration, login, profile
│   │   ├── ride.controller.js        # Ride creation, confirmation, completion
│   │   └── map.controller.js         # Maps & location-related endpoints
│   │
│   ├── services/                     # Business logic & database operations
│   │   ├── user.service.js           # User CRUD operations
│   │   ├── captain.service.js        # Captain CRUD operations
│   │   ├── ride.service.js           # Ride logic (create, confirm, complete)
│   │   ├── map.service.js            # Google Maps integration & distance calc
│   │   └── fare.util.js              # Fare calculation logic
│   │
│   ├── models/                       # Database schemas
│   │   ├── user.model.js             # User schema with auth methods
│   │   ├── captain.module.js         # Captain schema with auth methods
│   │   ├── ride.module.js            # Ride schema with status tracking
│   │   ├── blacklistToken.model.js   # Token blacklist for logout
│   │   └── middlewares/
│   │       └── auth.middleware.js    # JWT verification middleware
│   │
│   ├── routes/                       # API endpoints
│   │   ├── user.routes.js            # /users/* endpoints
│   │   ├── captain.routes.js         # /captains/* endpoints
│   │   ├── ride.routes.js            # /rides/* endpoints
│   │   └── map.routes.js             # /map/* endpoints
│   │
│   └── db/
│       └── db.js                     # MongoDB connection setup
│
├── Frontend/                         # React/Vite Application
│   ├── src/
│   │   ├── main.jsx                  # React entry point with providers
│   │   ├── App.jsx                   # Main app router
│   │   ├── App.css                   # Global styles
│   │   ├── index.css                 # Base styles
│   │   │
│   │   ├── context/                  # Global state management
│   │   │   ├── UserContext.jsx       # User state & auth
│   │   │   ├── CaptainContext.jsx    # Captain state & auth
│   │   │   └── SocketContext.jsx     # Socket.IO connection & events
│   │   │
│   │   ├── Pages/                    # Full page components
│   │   │   ├── Start.jsx             # Landing/Home page
│   │   │   ├── UserLogin.jsx         # User login page
│   │   │   ├── UserSignup.jsx        # User registration page
│   │   │   ├── UserLogout.jsx        # User logout
│   │   │   ├── UserProtectWrapper.jsx # Protected route wrapper for users
│   │   │   ├── Home.jsx              # User home (search & booking)
│   │   │   ├── Riding.jsx            # User riding status page
│   │   │   ├── CaptainLogin.jsx      # Captain login page
│   │   │   ├── CaptainSignup.jsx     # Captain registration page
│   │   │   ├── CaptainProtectWrapper.jsx # Protected route wrapper for captains
│   │   │   ├── CaptainHome.jsx       # Captain home (available rides)
│   │   │   ├── CaptainRiding.jsx     # Captain riding status page
│   │   │   └── test.jsx              # Test component
│   │   │
│   │   ├── componets/                # Reusable UI components
│   │   │   ├── LocationSearchPanel.jsx    # Location input & suggestions
│   │   │   ├── VehiclePanel.jsx          # Vehicle type selection
│   │   │   ├── ConfirmRidePopUp.jsx      # Ride confirmation popup
│   │   │   ├── ConfirRide.jsx            # Confirm ride details
│   │   │   ├── LookingForDriver.jsx      # Searching for driver
│   │   │   ├── RidePopUp.jsx             # Ride available notification
│   │   │   ├── WaitingForDriver.jsx      # Waiting for driver to arrive
│   │   │   ├── FinishRide.jsx            # Ride completion component
│   │   │   └── CaptainDetails.jsx        # Captain info display
│   │   │
│   │   └── assets/                   # Images, icons, static files
│   │
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── eslint.config.js              # ESLint rules
│   ├── index.html                    # HTML entry point
│   └── public/                       # Static assets
│
└── package.json                      # Root package (axios)
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas)
- **Google Maps API Key**
- **npm** or **yarn**

### Step 1: Clone & Navigate
```bash
cd uber-app
```

### Step 2: Backend Setup
```bash
cd Backend
npm install
```

### Step 3: Frontend Setup
```bash
cd ../Frontend
npm install
```

### Step 4: Configure Environment Variables
Create a `.env` file in the `Backend/` directory (see [Environment Variables](#environment-variables) section)

---

## 🔐 Environment Variables

Create `Backend/.env` with the following variables:

```env
# Server Port
PORT=4000

# MongoDB Connection String
DB_CONNECT=mongodb://localhost:27017/uber-video
# OR use MongoDB Atlas:
# DB_CONNECT=mongodb+srv://username:password@cluster.mongodb.net/uber-video

# JWT Secret (used for token signing)
JWT_SECRET=mySuperSecretKey12345

# Google Maps API Key
GOOGLE_MAPS_API=AIzaSyDG2CVFQZNnAb8kU_J7N2iYjrE0LwWk1EA
```

### Important Notes:
- **JWT_SECRET**: Should be a strong, random string in production
- **DB_CONNECT**: MongoDB connection URL
- **GOOGLE_MAPS_API**: Get from [Google Cloud Console](https://console.cloud.google.com/)
- **PORT**: Default is 4000

---

## ▶️ Running the Project

### Terminal 1: Start MongoDB
```bash
# If running locally
mongod

# OR use MongoDB Atlas (no local server needed)
```

### Terminal 2: Start Backend Server
```bash
cd Backend
npm install  # if not done
node server.js
```
Expected output:
```
Server is running on port 4000
[Socket] ✅ Socket.IO initialized
```

### Terminal 3: Start Frontend Development Server
```bash
cd Frontend
npm install  # if not done
npm run dev
```
Expected output:
```
VITE v7.0.3 ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Access the App
- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:4000/

---

## 🔄 Project Flow

### 1️⃣ User Registration & Authentication Flow
```
User Signup Page → Register (POST /users/register)
    ↓
Backend validates input & hashes password
    ↓
Store user in MongoDB
    ↓
Generate JWT token → Return token to frontend
    ↓
Token stored in cookies/localStorage
    ↓
User authenticated ✅
```

### 2️⃣ Ride Request Flow (User Perspective)
```
User Login → Home Page
    ↓
Enter Pickup Location → Enter Destination
    ↓
Select Vehicle Type (Car/Bike/Auto)
    ↓
System calculates FARE (GET /rides/fare)
    ↓
User confirms ride (POST /rides/create)
    ↓
Backend finds nearby captains (within 5km radius)
    ↓
Socket.IO sends "new-ride" event to available captains
    ↓
User sees "Looking for Driver" screen
    ↓
Waiting for captain acceptance...
```

### 3️⃣ Ride Acceptance Flow (Captain Perspective)
```
Captain logs in → Captain Home Page
    ↓
Receives "new-ride" notification via Socket.IO
    ↓
Views ride details (Pickup, Destination, Passenger name)
    ↓
Captain can accept or reject the ride
    ↓
If accepted: Send ride confirmation (POST /rides/confirm)
    ↓
Socket.IO notifies user: "ride-confirmed"
    ↓
Both user & captain see real-time location updates
```

### 4️⃣ Real-Time Location Tracking
```
Captain Starts Driving
    ↓
Socket.IO event "update-location-captain" fired
    ↓
Location (lat, lng) sent to backend
    ↓
Backend broadcasts location to user via Socket.IO
    ↓
User sees captain's real-time location on map
    ↓
Captain arrives → Pickup passenger
    ↓
Ride starts → Destination tracking begins
```

### 5️⃣ Ride Completion Flow
```
Captain reaches destination
    ↓
User confirms arrival
    ↓
Ride marked as "completed"
    ↓
Fare charged to user account
    ↓
Rating & feedback (optional)
    ↓
Ride history updated for both parties
```

---

## 📡 API Endpoints

### User Endpoints (`/users/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/users/register` | Register new user | ❌ |
| POST | `/users/login` | Login user | ❌ |
| GET | `/users/profile` | Get user profile | ✅ |
| POST | `/users/logout` | Logout user | ✅ |

**Register Request:**
```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Captain Endpoints (`/captains/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/captains/register` | Register new captain | ❌ |
| POST | `/captains/login` | Login captain | ❌ |
| GET | `/captains/profile` | Get captain profile | ✅ |

### Ride Endpoints (`/rides/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/rides/create` | Create new ride request | ✅ |
| GET | `/rides/fare` | Calculate fare | ❌ |
| POST | `/rides/confirm` | Captain accepts ride | ✅ |
| POST | `/rides/start` | Start ongoing ride | ✅ |
| POST | `/rides/end` | Complete ride | ✅ |

**Create Ride Request:**
```json
{
  "userId": "user_id_here",
  "pickup": "123 Main Street, City",
  "destination": "456 Oak Avenue, City",
  "vehicleType": "car"  // or "bike", "auto"
}
```

### Map Endpoints (`/map/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/map/get-coordinates` | Get coordinates for address | ❌ |
| GET | `/map/distance-time` | Calculate distance & time | ❌ |
| GET | `/map/get-suggestions` | Autocomplete suggestions | ❌ |

---

## 🔌 Socket.IO Events

### Client → Server Events

#### 1. **Update Socket ID**
```javascript
socket.emit('json', {
  userId: 'user_id',
  userType: 'user'  // or 'captain'
});
```

#### 2. **Update Captain Location**
```javascript
socket.emit('update-location-captain', {
  userId: 'captain_id',
  location: {
    lat: 40.7128,
    lng: -74.0060
  }
});
```

#### 3. **Captain Accept Ride**
```javascript
socket.emit('ride-accepted', {
  rideId: 'ride_id',
  captainId: 'captain_id'
});
```

#### 4. **Captain Start Ride**
```javascript
socket.emit('ride-started', {
  rideId: 'ride_id'
});
```

#### 5. **End Ride**
```javascript
socket.emit('ride-ended', {
  rideId: 'ride_id'
});
```

### Server → Client Events

#### 1. **New Ride Available** (Captain receives)
```javascript
socket.on('new-ride', (data) => {
  // data contains ride details:
  // {
  //   _id: ride_id,
  //   user: { name, email, ...},
  //   pickup: location,
  //   destination: location,
  //   vehicleType: 'car',
  //   fare: amount,
  //   distance: km,
  //   duration: minutes
  // }
});
```

#### 2. **Ride Confirmed** (User receives)
```javascript
socket.on('ride-confirmed', (data) => {
  // data contains captain details and ride info
});
```

#### 3. **Location Updated** (User receives)
```javascript
socket.on('location-updated-user', (data) => {
  // Captain's real-time location
  // {
  //   lat: number,
  //   lng: number
  // }
});
```

#### 4. **Ride Started**
```javascript
socket.on('ride-started', (data) => {
  // Ride is now in progress
});
```

#### 5. **Ride Ended**
```javascript
socket.on('ride-ended', (data) => {
  // Ride completed
});
```

#### 6. **Error Event**
```javascript
socket.on('error abhi', (data) => {
  // Error handling
});
```

---

## 🗄️ Database Schema

### User Schema
```javascript
{
  fullname: {
    firstname: String,    // min 3 chars, required
    lastname: String      // min 3 chars
  },
  email: String,          // unique, required, min 5 chars
  password: String,       // hashed, required, not selected by default
  socketID: String,       // For real-time communication
  createdAt: Date         // Auto-generated
}
```

**User Methods:**
- `generateAuthToken()` - Creates JWT token
- `comparePassword(password)` - Verifies password
- `hashPassword(password)` - Static method to hash password

### Captain Schema
```javascript
{
  fullname: {
    firstname: String,
    lastname: String
  },
  email: String,          // unique, required
  password: String,       // hashed
  socketId: String,       // Real-time tracking
  vehicle: {
    color: String,
    plate: String,
    capacity: Number,
    vehicleType: String   // 'car', 'bike', 'auto'
  },
  location: {
    lat: Number,
    lng: Number
  },
  status: String,         // 'active', 'inactive'
  createdAt: Date
}
```

### Ride Schema
```javascript
{
  user: ObjectId,         // Reference to User
  captain: ObjectId,      // Reference to Captain (after acceptance)
  pickup: String,         // Pickup address
  destination: String,    // Destination address
  fare: Number,           // Calculated fare
  distance: Number,       // In km
  duration: Number,       // In minutes
  status: String,         // 'pending', 'accepted', 'completed', 'cancelled'
  vehicleType: String,    // 'car', 'bike', 'auto'
  Otp: String,           // One-time password for verification
  rating: Number,         // 1-5 stars
  createdAt: Date,
  updatedAt: Date
}
```

### Blacklist Token Schema
```javascript
{
  token: String,          // JWT token to blacklist
  createdAt: Date,        // Auto-expires after 24h
  expiresAt: Date
}
```

---

## 🎨 Frontend Components

### Pages

| Page | Path | Description |
|------|------|-------------|
| **Start** | `/` | Landing page with login/signup options |
| **User Login** | `/login` | User authentication page |
| **User Signup** | `/signup` | User registration page |
| **User Home** | `/home` | Main page to search and book rides |
| **Riding** | `/riding` | Active ride status (user perspective) |
| **Captain Login** | `/captain-login` | Captain authentication |
| **Captain Signup** | `/captain-Signup` | Captain registration |
| **Captain Home** | `/captain-home` | Available rides for captain |
| **Captain Riding** | `/captain-riding` | Active ride (captain perspective) |
| **Logout** | `/users/logout` | Logout and redirect |

### Reusable Components

| Component | Purpose |
|-----------|---------|
| **LocationSearchPanel** | Location input with Google Places suggestions |
| **VehiclePanel** | Vehicle type selection (Car/Bike/Auto) |
| **ConfirmRidePopUp** | Popup to confirm ride details |
| **ConfirmRide** | Final ride confirmation screen |
| **LookingForDriver** | Loading screen while searching for driver |
| **RidePopUp** | Notification when ride is available (captain) |
| **WaitingForDriver** | User waiting for captain to arrive |
| **FinishRide** | Ride completion and rating screen |
| **CaptainDetails** | Display captain info on ride |

### Context (Global State)

#### **UserContext**
Manages user authentication state:
```javascript
{
  user: { _id, email, fullname, ... },
  isLoading: Boolean,
  error: String,
  loggedIn: Boolean
}
```

#### **CaptainContext**
Manages captain authentication state:
```javascript
{
  captain: { _id, email, fullname, vehicle, ... },
  isLoading: Boolean,
  error: String,
  loggedIn: Boolean
}
```

#### **SocketContext**
Manages Socket.IO connection:
```javascript
{
  socket: SocketInstance,
  connected: Boolean,
  events: { ... }
}
```

---

## ⭐ Key Features

### 1. **Dual Authentication System**
- Separate login flows for Users and Captains
- JWT-based authentication
- Password hashing with bcrypt
- Automatic token refresh

### 2. **Real-Time Ride Matching**
- Find captains within 5km radius of pickup
- Instant notifications via Socket.IO
- Captain can accept or reject rides

### 3. **Location-Based Services**
- Google Maps integration
- Real-time location tracking
- Distance & fare calculation
- Address autocomplete suggestions

### 4. **Live Location Updates**
- Captain location broadcast to user
- User sees captain approaching in real-time
- Multi-device support via Socket.IO

### 5. **Ride Management**
- Create, confirm, start, and complete rides
- OTP verification for ride confirmation
- Ride history tracking
- Status updates in real-time

### 6. **Fare Calculation**
- Dynamic pricing based on distance
- Different rates for vehicle types
- Transparent fare display before booking

### 7. **Protected Routes**
- User and Captain route protection
- Automatic redirect if not authenticated
- Session management with JWT

### 8. **Responsive Design**
- Mobile-first UI with Tailwind CSS
- Smooth animations with GSAP
- Optimized for all screen sizes

---

## 🔧 CORS Configuration

The application allows requests from:
- `http://localhost:5173` (Local frontend)
- `https://lx36v5dk-5173.inc1.devtunnels.ms` (Dev tunnel frontend)

**To add more origins**, update `Backend/app.js`:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-domain.com'
];
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: "Cannot connect to MongoDB"**
- Ensure MongoDB is running (`mongod`)
- Check `DB_CONNECT` in `.env`
- Verify MongoDB URI format

**Problem: "Socket connection refused"**
- Check if backend server is running on port 4000
- Verify `PORT` in `.env`
- Check CORS origins configuration

**Problem: "Google Maps API error"**
- Verify `GOOGLE_MAPS_API` key in `.env`
- Check API key has Maps & Geocoding enabled
- Ensure billing is enabled on Google Cloud

### Frontend Issues

**Problem: "Blank page on localhost:5173"**
- Run `npm install` in Frontend directory
- Check browser console for errors
- Verify backend API is running

**Problem: "Socket.IO connection failed"**
- Check backend is running
- Verify socket URL in frontend code
- Check CORS origins

**Problem: "Can't find coordinates"**
- Verify Google Maps API key
- Check address format
- Ensure API has Geocoding enabled

---

## 📝 Example Workflow

### Complete User Journey

```
1. User opens app (http://localhost:5173/)
   ↓
2. Clicks "Signup" → Register as new user
   ↓
3. Email & password saved in MongoDB
   ↓
4. Redirected to login page
   ↓
5. Login with credentials → JWT token generated
   ↓
6. Token stored in cookies/localStorage
   ↓
7. Redirected to /home (protected route)
   ↓
8. User enters "Pickup: 123 Main St, Destination: 456 Oak Ave"
   ↓
9. Frontend calls GET /rides/fare → Fare calculated ($15)
   ↓
10. User selects vehicle type "Car"
    ↓
11. User clicks "Book Ride" → POST /rides/create
    ↓
12. Backend finds 3 captains within 5km
    ↓
13. Socket.IO sends "new-ride" event to captains
    ↓
14. User sees "Looking for Driver" spinner
    ↓
15. Captain1 receives notification, views ride details
    ↓
16. Captain1 accepts ride → POST /rides/confirm
    ↓
17. User receives "ride-confirmed" event
    ↓
18. Captain's location streamed to user in real-time
    ↓
19. Captain arrives at pickup → Picks up user
    ↓
20. Ride starts → Destination tracking active
    ↓
21. Captain reaches destination → Ride completes
    ↓
22. User rates captain (5 stars) & leaves feedback
    ↓
23. Ride added to history for both user & captain
    ✅ Journey Complete!
```

---

## 🚀 Deployment Tips

### Backend Deployment (Heroku, Railway, Render)
```bash
# Ensure all env vars are set in deployment platform
# Ensure MongoDB Atlas connection is configured
# Push code to Git and deploy
```

### Frontend Deployment (Vercel, Netlify)
```bash
# Update API base URL to production backend
# Build: npm run build
# Deploy dist folder
```

### Environment Variables for Production
```env
PORT=4000
DB_CONNECT=mongodb+srv://user:pass@cluster.mongodb.net/uber
JWT_SECRET=<strong-random-key>
GOOGLE_MAPS_API=<production-api-key>
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Google Maps API](https://developers.google.com/maps)

---

## 📄 License

ISC

---

## 👤 Author

Created as a learning project for full-stack web development

---

## 🤝 Contributing

Feel free to fork and submit pull requests for improvements!

---

**Last Updated**: May 2026
**Version**: 1.0.0
