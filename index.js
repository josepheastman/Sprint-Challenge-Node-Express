const server = require('./api/server.js');

const port = 5000;

server.listen(port, err => {
    if (err) console.log(err);
    console.log(`server is listening on port ${port}`)
})