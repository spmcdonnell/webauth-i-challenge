// Import dependencies
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Routing and database access
const usersRouter = require('./users/users-routes.js');
const Users = require('./users/users-model.js');

// Server instance
const server = express();

// Session config
const sessionConfig = {
    name: 'pretzelsaregood', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: true // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false
};

// Use
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
server.use('/api/users', usersRouter);

// General endpoints
server.get('/', (req, res) => {
    res.send('Server running...');
});

server.post('/api/register', (req, res) => {
    let { username, password } = req.body;
    console.log(username, password);

    const hash = bcrypt.hashSync(password, 8);

    Users.add({ username, password: hash })
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

module.exports = server;
