const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs');

const Users = require('./users-model.js');

router.get('/', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

// Middleware
// function restricted(req, res, next) {
//     const { username, password } = req.headers;

//     if (username && password) {
//         Users.findBy({ username })
//             .first()
//             .then(user => {
//                 if (user && bcrypt.compareSync(password, user.password)) {
//                     next();
//                 } else {
//                     res.status(401).json({ message: 'Invalid Credentials' });
//                 }
//             })
//             .catch(error => {
//                 res.status(500).json({ message: 'Unexpected error' });
//             });
//     } else {
//         res.status(400).json({ message: 'No credentials provided' });
//     }
// }

function restricted(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(400).json({ message: 'No credentials provided' });
    }
}

module.exports = router;
