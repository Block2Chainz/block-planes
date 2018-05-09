require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = require('../routes/index.js');
const path = require('path');

const PORT = process.env.PORT || 1234
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(express.static(path.join(__dirname, '../../block-planes-client/public')));
server.use('/', router);

server.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../../block-planes-client/public/index.html')));

server.listen(PORT, () => console.log('serving static files on port ', PORT));
