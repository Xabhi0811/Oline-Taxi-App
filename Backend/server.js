const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 4000;

const server = http.createServer(app);
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.setTimeout(20000);

initializeSocket(server);

require('./db/db')().then(() => server.listen(port, () => {
    console.log(`Server is running on port ${server.address().port}`);
})).catch(() => {
    console.error('Database connection failed. Check configuration and availability.');
    process.exitCode = 1;
});
