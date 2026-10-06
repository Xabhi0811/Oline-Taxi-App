# Uber ride demo

A React/Vite frontend and Express/Mongoose backend with authenticated Socket.IO ride notifications. This is a learning app, not a production dispatch or payment system.

## Setup

Use Node.js 22.12+ (verified with 22.14.0), npm, and MongoDB. Install the committed lockfiles:

~~~powershell
npm ci
npm --prefix Backend ci
npm --prefix Frontend ci
~~~

Installed node_modules directories are ignored; they are not source artifacts.

Configure these variables privately:

| File | Variables |
| --- | --- |
| Backend/.env | DB_CONNECT, JWT_SECRET, GOOGLE_MAPS_API, optional PORT (default 4000), optional FRONTEND_URL |
| Frontend/.env | VITE_BACKEND_URL, VITE_SOCKET_URL (normally http://localhost:4000) |

Use a strong random JWT secret. Enable billing and the Google Geocoding API, Places API (New), and Routes API in the project owning the backend Maps key. The key's API restrictions must also allow all three services. Never commit credentials. Backend HTTP CORS permits localhost/127.0.0.1:5173, FRONTEND_URL, and the existing development tunnel configured in app.js; Socket.IO permits the two local origins and FRONTEND_URL.

Run `npm --prefix Backend run check:maps` to check all three services using public landmarks. It prints only success/error codes, never the key or raw Google responses. Search uses Places Autocomplete (New), and fares use Routes Compute Routes. Suggestions display loading, empty-result and configuration-error states. Billing or key restrictions must be corrected in Google Cloud; restarting the backend is required after changing its `.env` key.

~~~powershell
cd Backend
node server.js
# In another terminal:
cd Frontend
npm run dev
~~~

The backend waits for MongoDB before listening. GET / returns hello; GET /health returns 200 when the database is connected, otherwise 503. The frontend normally runs on port 5173.

## Authentication and routes

Supply Authorization: Bearer <token> on protected HTTP requests. Login also sets a cookie; the frontend stores role-specific tokens in localStorage. Tokens expire after 24 hours; there is no refresh-token endpoint.

| Method | Route | Authentication and input |
| --- | --- | --- |
| POST | /users/register | Public; fullName.firstName, fullName.lastName, email, password |
| POST | /users/login | Public; email, password |
| GET | /users/profile | Rider |
| POST | /users/logout | Rider; blacklists current token |
| POST | /captains/register | Public; fullname.firstname, optional fullname.lastname, email, password, vehicle |
| POST | /captains/login | Public; email, password |
| GET | /captains/profile | Captain |
| GET | /captains/logout | Captain; blacklists current token |
| POST | /captains/test | Public diagnostic text route |
| GET | /rides/get-fare | Rider; pickup, destination query parameters |
| POST | /rides/create | Rider; pickup, destination, vehicleType body fields |
| POST | /rides/confirm | Captain; rideId |
| POST | /rides/start | Assigned captain; rideId and six-digit otp in JSON body |
| POST | /rides/end | Assigned captain; rideId |
| GET | /rides/user/:rideId | Owning rider only |
| GET | /rides/captain/:rideId | Assigned captain only |
| GET | /map/get-coordinates | Rider; address |
| GET | /map/get-distance-time | Rider; origin, destination |
| GET | /map/get-suggestions | Rider; input |

Rider signup uses fullName.firstName/lastName, while returned profiles use fullname.firstname/lastname. Captain signup uses lowercase fullname fields. Vehicle fields are color, plate, capacity, vehicleType. Captain registration supports car, bike, auto and truck, but rides support only car, bike and auto.

Ride identity always comes from authentication, never a submitted userId or captainId. The old GET /rides/start-ride route is removed so an OTP is not placed in query strings. /rides/fare and /map/distance-time are not routes.

## Ride flow and data boundaries

1. A rider requests a fare and books. Geocoding, nearby-captain lookup and fare lookup complete before a ride is saved.
2. An offer is persisted for each connected, matching-vehicle captain within 5 km of pickup, whose location was updated within five minutes and who had no accepted/ongoing ride at offer time.
3. A captain can accept only a pending ride with their ID in its offeredCaptains list and a matching current vehicle type. These conditions are part of one atomic MongoDB update. Competing acceptance yields one success and a 409 conflict.
4. The rider sees the six-digit OTP. The assigned captain asks the rider for it, then POSTs it to /rides/start. Only an accepted ride with matching captain and OTP can become ongoing.
5. The assigned captain completes an ongoing ride through /rides/end. Payment is cash; there is no payment processing.
6. Both home screens and ride screens reload their remembered ride ID through an authorized HTTP endpoint after refresh or socket readiness. IDs are stored in sessionStorage.

HTTP and socket ride payloads use explicit field allow lists. Captain responses never include the OTP, rider email, password hash, socket ID, payment metadata, or offered-captain list. A new-ride notification contains only _id, pickup, destination, fare, and user.fullname. Rider creation/read/confirmation payloads may contain Otp while pending or accepted; ongoing/completed payloads omit it.

Socket connections require auth: { token, role }, with role user or captain. The server verifies identity and blacklist status and stores the current socket ID. No client-selected identity registration event is supported.

| Event | Direction | Meaning |
| --- | --- | --- |
| ready | Server to client | Authenticated socket registration completed |
| update-location-captain | Captain to server | location: { lat, lng }; validated and stored with server timestamp; optional acknowledgement |
| new-ride | Server to offered captain | Minimal ride offer |
| ride-confirmed | Server to owning rider | Rider DTO including captain display details and OTP |
| ride-started | Server to owning rider | Ride became ongoing |
| ride-ended | Server to owning rider | Ride completed |

Ride mutations use HTTP, not client-sent ride-accepted/ride-started/ride-ended socket events. Captain locations are stored for matching; they are not broadcast to riders. Displayed maps are static images, not live tracking.

## Limits and external calls

- Login and registration share a limit of 20 requests per IP per 15 minutes across both roles.
- All Maps routes, fare and creation share 60 requests per IP per minute.
- OTP start has 20 requests per IP per 15 minutes.
- Limits return 429 with Retry-After and rate-limit headers. The in-memory stores are per process; multi-instance deployment requires a shared store and an explicitly configured trusted proxy.
- Address inputs are bounded to 300 characters, JSON/form bodies to 16 KB.
- Google requests use a five-second Axios timeout, six-second abort deadline, 1 MB response limit and no redirects. Coordinates, distances, durations and suggestions are validated.
- Server request/header timeouts are 15/10 seconds with a 20-second socket inactivity timeout; frontend Axios calls time out after 10 seconds.
- Locations, authentication data and raw upstream errors are not logged by application code. Configure infrastructure access logs to redact query strings and request bodies.

## Verification

~~~powershell
npm --prefix Backend test
npm --prefix Backend run test:browser
npm --prefix Frontend run lint
npm --prefix Frontend run build
npm audit
npm --prefix Backend audit
npm --prefix Frontend audit
~~~

Backend tests start a disposable local MongoDB using mongodb-memory-server and mock Google responses. First use may need a MongoDB binary download. The browser script also starts isolated API/Vite servers and uses installed Google Chrome through Playwright; it does not use the configured database or live Maps. It covers both roles, fare failures, booking through completion, refresh recovery and unauthorized redirect.

See WORK.md for executed commands, results, security-review applicability, and remaining limitations. There are no implemented ratings, ride-history listing, automatic token refresh, live-map navigation, or electronic payments. Multiple simultaneous devices, offer expiry/re-delivery, and one-active-ride-per-captain across different rides are not guaranteed.
