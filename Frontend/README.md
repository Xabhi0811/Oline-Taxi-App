# Frontend

React/Vite ride demo. See the root [README](../README.md) for setup and the implemented workflow.

~~~powershell
npm ci
npm run dev
npm run lint
npm run build
~~~

Set VITE_BACKEND_URL and VITE_SOCKET_URL privately. The app uses separate rider/captain tokens in localStorage and remembers ride IDs in sessionStorage. Socket readiness and page refresh trigger authorized ride recovery. Maps are static illustrations; browser geolocation updates captain matching coordinates.

Run npm run test:browser from Backend to exercise both roles against disposable MongoDB and mocked Maps using installed Chrome.
