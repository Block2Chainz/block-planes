const express = require('express');
const path = require('path');

const server = express();
const PORT = process.env.PORT || 1234

server.use(express.static(path.join(__dirname, '../../block-planes-client/public')));

// sesrver.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../../block-planes-client/public/index.html')));

server.listen(PORT, () => console.log('serving static files on port ', PORT));
