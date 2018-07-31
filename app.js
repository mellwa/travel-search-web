
const http = require('http');

const host = '127.0.0.1';
const port = process.env.PORT || 3000;
const dist_dir = __dirname+'/front/dist';

const express = require("express");
let app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(dist_dir));

let indexRouter = require('./routes/index');
app.use('/', indexRouter);

// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end('hello world');
// });

app.listen(port, host, () => {
    console.log('server started on ' + host + ':' + port+' '+dist_dir);
});
