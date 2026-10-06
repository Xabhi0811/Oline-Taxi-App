# Backend

See the root [README](../README.md) for the implemented routes, authentication, ride DTOs, eligibility rule, rate limits, environment setup and limitations.

From this directory:

~~~powershell
npm ci
npm test
npm run test:browser
node server.js
~~~

Tests use disposable MongoDB and mocked Maps. Browser tests require installed Google Chrome.

User registration is POST /users/register with fullName.firstName, fullName.lastName, email and password. Captain registration uses fullname.firstname/lastname plus vehicle. Invalid input returns a generic message without echoing submitted credentials.
