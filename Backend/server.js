const http = require('http');
const app = require('./app')
const port = process.env.PORT|| 4000;


const server = http.createServer(app);

server.listen(port, () =>{
    console.log(`sever is running on port ${port}`);
})