const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFile =
path.join(
    __dirname,
    "../data/users.json"
);

function getUsers(){

    return JSON.parse(
        fs.readFileSync(
            usersFile,
            "utf8"
        )
    );

}

function saveUsers(users){

    fs.writeFileSync(
        usersFile,
        JSON.stringify(
            users,
            null,
            2
        )
    );

}


// GET USERS

router.get("/", (req,res)=>{

    res.json(
        getUsers()
    );

});


// ADD USER

router.post("/", (req,res)=>{

    const users =
    getUsers();

    const {

        name,
        role

    } = req.body;

    const user = {

        id: Date.now(),

        name,

        role

    };

    users.push(user);

    saveUsers(users);

    res.json(user);

});


// DELETE USER

router.delete("/:id",(req,res)=>{

    const users =
    getUsers();

    const filtered =
    users.filter(
        u => u.id != req.params.id
    );

    saveUsers(filtered);

    res.json({
        message:"Deleted"
    });

});

module.exports = router;