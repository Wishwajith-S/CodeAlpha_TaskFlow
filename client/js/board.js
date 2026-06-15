const socket = io(
    "http://localhost:5000"
);
async function loadTeamMembers(){

    const response =
    await fetch(
        "http://localhost:5000/api/users"
    );

    const users =
    await response.json();

    const select =
    document.getElementById(
        "assignedTo"
    );

    select.innerHTML = `

        <option value="">
            Select Team Member
        </option>

    `;

    users.forEach(user => {

        select.innerHTML += `

            <option value="${user.name}">
                ${user.name}
            </option>

        `;

    });

}
async function loadTasks() {

    const response =
    await fetch(
        "http://localhost:5000/api/tasks"
    );
    socket.emit(
    "taskChanged"
);

    const tasks =
    await response.json();

    const searchValue =
    document.getElementById(
        "searchTask"
    )?.value
    .toLowerCase() || "";

    const priorityValue =
    document.getElementById(
        "priorityFilter"
    )?.value || "";

    const filteredTasks =
    tasks.filter(task => {

        const matchesSearch =
        task.title
        .toLowerCase()
        .includes(searchValue);

        const matchesPriority =
        !priorityValue ||
        task.priority === priorityValue;

        return (
            matchesSearch &&
            matchesPriority
        );

    });

    document.getElementById(
        "taskCount"
    ).textContent =
    filteredTasks.length;

    document.getElementById(
        "todo"
    ).innerHTML = "";

    document.getElementById(
        "progress"
    ).innerHTML = "";

    document.getElementById(
        "done"
    ).innerHTML = "";

    filteredTasks.forEach(task => {

        let priorityClass = "";

        if(task.priority === "High"){

            priorityClass =
            "high-priority";

        }
        else if(task.priority === "Medium"){

            priorityClass =
            "medium-priority";

        }
        else{

            priorityClass =
            "low-priority";

        }

        const card = `

        <div class="task-card">

            <h3>${task.title}</h3>

            <p>${task.description || ""}</p>

            <div class="${priorityClass}">
                ${task.priority || "Low"}
            </div>

            <br>

            <small>
                👤 ${task.assignedTo || "Unassigned"}
            </small>

            <br>

            <small>
                📅 ${task.dueDate || "No Date"}
            </small>

            <br>

            <small>
                ${task.createdAt}
            </small>

            <br><br>

            ${
                task.status !== "todo"
                ?
                `<button onclick="moveTask(${task.id},'todo')">Todo</button>`
                :
                ""
            }

            ${
                task.status !== "progress"
                ?
                `<button onclick="moveTask(${task.id},'progress')">Progress</button>`
                :
                ""
            }

            ${
                task.status !== "done"
                ?
                `<button onclick="moveTask(${task.id},'done')">Done</button>`
                :
                ""
            }

            <button
                onclick="editTask(${task.id})"
                style="background:#f59e0b;"
            >
                Edit
            </button>

            <button
                onclick="deleteTask(${task.id})"
                style="background:crimson;"
            >
                Delete
            </button>

        </div>

        `;

        if(task.status === "todo"){

            document.getElementById(
                "todo"
            ).innerHTML += card;

        }
        else if(task.status === "progress"){

            document.getElementById(
                "progress"
            ).innerHTML += card;

        }
        else{

            document.getElementById(
                "done"
            ).innerHTML += card;

        }

    });

}

async function createTask() {

    const title =
    document.getElementById(
        "taskTitle"
    ).value;

    const description =
    document.getElementById(
        "taskDescription"
    ).value;

    const assignedTo =
    document.getElementById(
        "assignedTo"
    ).value;

    const priority =
    document.getElementById(
        "priority"
    ).value;

    const dueDate =
    document.getElementById(
        "dueDate"
    ).value;

    await fetch(
        "http://localhost:5000/api/tasks",
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
                title,
                description,
                assignedTo,
                priority,
                dueDate,
                projectId:1
            })
        }
    );

    document.getElementById(
        "taskTitle"
    ).value = "";

    document.getElementById(
        "taskDescription"
    ).value = "";

    document.getElementById(
        "assignedTo"
    ).value = "";

    loadTasks();

}

async function moveTask(id,status){

    await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
            method:"PUT",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
                status
            })
        }
    );
    socket.emit(
    "taskChanged"
);

    loadTasks();

}

async function editTask(id){

    const title =
    prompt("New Title");

    if(title === null) return;

    const description =
    prompt("New Description");

    if(description === null) return;

    const assignedTo =
    prompt("Assigned User");

    if(assignedTo === null) return;

    const priority =
    prompt(
        "Priority (High / Medium / Low)"
    );

    if(priority === null) return;

    const dueDate =
    prompt(
        "Due Date (YYYY-MM-DD)"
    );

    if(dueDate === null) return;

    await fetch(
        `http://localhost:5000/api/tasks/edit/${id}`,
        {
            method:"PUT",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                title,
                description,
                assignedTo,
                priority,
                dueDate

            })
        }
    );

    loadTasks();

}

async function deleteTask(id){

    const confirmDelete =
    confirm(
        "Delete this task?"
    );

    if(!confirmDelete){
        return;
        socket.emit(
    "taskChanged"
);
    }

    await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
            method:"DELETE"
        }
    );

    loadTasks();

}
function drag(event){

    event.dataTransfer.setData(
        "taskId",
        event.target.dataset.id
    );

}

async function dropTask(
    event,
    status
){

    event.preventDefault();

    const taskId =
    event.dataTransfer.getData(
        "taskId"
    );

    await moveTask(
        taskId,
        status
    );

}

function allowDrop(event){

    event.preventDefault();

}

loadTeamMembers();
loadTasks();

socket.on(
    "taskUpdated",
    () => {

        loadTasks();

    }
);