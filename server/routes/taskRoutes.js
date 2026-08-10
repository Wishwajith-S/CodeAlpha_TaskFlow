const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const tasksFile =
path.join(
    __dirname,
    "../data/tasks.json"
);

function getTasks(){

    return JSON.parse(
        fs.readFileSync(
            tasksFile,
            "utf8"
        )
    );

}

function saveTasks(tasks){

    fs.writeFileSync(
        tasksFile,
        JSON.stringify(
            tasks,
            null,
            2
        )
    );

}

// GET ALL TASKS

router.get("/", (req, res) => {

    const tasks = getTasks();

    res.json(tasks);

});

// CREATE TASK

router.post("/", (req, res) => {

    const tasks = getTasks();

    const {
        title,
        description,
        assignedTo,
        priority,
        dueDate,
        projectId
    } = req.body;

    const task = {

        id: Date.now(),

        title,

        description,

        assignedTo,

        priority,

        dueDate,

        projectId,

        status: "todo",

        comments: [],

        createdAt:
        new Date().toLocaleString()

    };

    tasks.push(task);

    saveTasks(tasks);

    res.json(task);

});

// EDIT TASK

router.put("/edit/:id", (req, res) => {

    const tasks = getTasks();

    const task =
    tasks.find(
        t => t.id == req.params.id
    );

    if(!task){

        return res.status(404).json({
            message:"Task not found"
        });

    }

    task.title =
    req.body.title;

    task.description =
    req.body.description;

    task.assignedTo =
    req.body.assignedTo;

    task.priority =
    req.body.priority;

    task.dueDate =
    req.body.dueDate;

    saveTasks(tasks);

    res.json(task);

});

// MOVE TASK

router.put("/:id", (req, res) => {

    const tasks = getTasks();

    const task =
    tasks.find(
        t => t.id == req.params.id
    );

    if(!task){

        return res.status(404).json({
            message:"Task not found"
        });

    }

    task.status =
    req.body.status;

    saveTasks(tasks);

    console.log(
        "Task moved:",
        task.id,
        task.status
    );

    res.json(task);

});

// ADD COMMENT

router.post("/:id/comment", (req, res) => {

    const tasks = getTasks();

    const task =
    tasks.find(
        t => t.id == req.params.id
    );

    if(!task){

        return res.status(404).json({
            message:"Task not found"
        });

    }

    if(!task.comments){

        task.comments = [];

    }

    task.comments.push({

        username:
        req.body.username,

        text:
        req.body.text,

        createdAt:
        new Date().toLocaleString()

    });

    saveTasks(tasks);

    res.json(task);

});

// DELETE TASK

router.delete("/:id", (req, res) => {

    const tasks = getTasks();

    const filteredTasks =
    tasks.filter(
        t => t.id != req.params.id
    );

    saveTasks(filteredTasks);

    res.json({

        message:
        "Task deleted successfully"

    });

});

module.exports = router;