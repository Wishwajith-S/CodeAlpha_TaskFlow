const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const projectsFile =
path.join(
    __dirname,
    "../data/projects.json"
);

function getProjects(){

    return JSON.parse(
        fs.readFileSync(
            projectsFile,
            "utf8"
        )
    );

}

function saveProjects(projects){

    fs.writeFileSync(
        projectsFile,
        JSON.stringify(
            projects,
            null,
            2
        )
    );

}


// GET ALL PROJECTS

router.get("/", (req, res) => {

    const projects =
    getProjects();

    res.json(projects);

});


// CREATE PROJECT

router.post("/", (req, res) => {

    const projects =
    getProjects();

    const {
        title,
        description,
        createdBy
    } = req.body;

    const project = {

        id: Date.now(),

        title,

        description,

        createdBy,

        createdAt:
        new Date().toLocaleString()

    };

    projects.push(project);

    saveProjects(projects);

    res.status(201).json(project);

});


// DELETE PROJECT

router.delete("/:id", (req, res) => {

    const projects =
    getProjects();

    const filteredProjects =
    projects.filter(
        p => p.id != req.params.id
    );

    saveProjects(
        filteredProjects
    );

    res.json({
        message:
        "Project deleted"
    });

});

module.exports = router;