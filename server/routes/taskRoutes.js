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

    const tasks =
    getTasks();

    res.json(tasks);

});


// CREATE TASK

router.post("/", (req, res) => {

    const tasks =
    getTasks();

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

        createdAt:
        new Date().toLocaleString()

    };

    tasks.push(task);

    saveTasks(tasks);

    res.json(task);

});

router.put("/edit/:id", (req, res) => {

    const tasks =
    getTasks();

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

    const tasks =
    getTasks();

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

    res.json(task);

});


// EDIT TASK


async function dropTask(
    event,
    status
){

    event.preventDefault();

    const taskId =
    event.dataTransfer.getData(
        "taskId"
    );

    console.log(
        "Dropped:",
        taskId,
        status
    );

    await moveTask(
        taskId,
        status
    );

}

// DELETE TASK

router.delete("/:id", (req, res) => {

    const tasks =
    getTasks();

    const filteredTasks =
    tasks.filter(
        t => t.id != req.params.id
    );

    saveTasks(
        filteredTasks
    );

    res.json({

        message:
        "Task deleted successfully"

    });

});

module.exports = router;