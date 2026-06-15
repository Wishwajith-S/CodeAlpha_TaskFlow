const express = require("express");

const router = express.Router();

const users =
require("../data/users");

router.post(
    "/register",
    (req, res) => {

        const {
            username,
            email,
            password
        } = req.body;

        const user = {

            id: Date.now(),

            username,

            email,

            password

        };

        users.push(user);

        res.json(user);

    }
);

router.post(
    "/login",
    (req, res) => {

        const {
            email,
            password
        } = req.body;

        const user =
        users.find(
            u =>
            u.email === email &&
            u.password === password
        );

        if(!user){

            return res.status(401)
            .json({
                message:
                "Invalid credentials"
            });

        }

        res.json(user);

    }
);

module.exports = router;