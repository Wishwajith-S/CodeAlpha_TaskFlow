async function loadProjects() {

    const projectResponse =
    await fetch(
        "https://taskflow-backend-tmc5.onrender.com/api/projects"
    );

    const projects =
    await projectResponse.json();

    const taskResponse =
    await fetch(
        "https://taskflow-backend-tmc5.onrender.com/api/tasks"
    );

    const tasks =
    await taskResponse.json();

    document.getElementById(
        "totalProjects"
    ).textContent =
    projects.length;

    document.getElementById(
        "totalTasks"
    ).textContent =
    tasks.length;

    document.getElementById(
        "completedTasks"
    ).textContent =
    tasks.filter(
        t => t.status === "done"
    ).length;

    document.getElementById(
        "pendingTasks"
    ).textContent =
    tasks.filter(
        t => t.status !== "done"
    ).length;

    const container =
    document.getElementById(
        "projectsContainer"
    );

    container.innerHTML = "";

    projects.forEach(project => {

        const projectTasks =
        tasks.filter(
            task =>
            task.projectId == project.id
        );

        const completed =
        projectTasks.filter(
            task =>
            task.status === "done"
        ).length;

        const total =
        projectTasks.length;

        const progress =
        total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
        );

        container.innerHTML += `

        <div class="project-card">

            <h2>${project.title}</h2>

            <p>${project.description}</p>

            <small>
                ${project.createdAt}
            </small>

            <br><br>

            <h4>
                Progress: ${progress}%
            </h4>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="
                    width:${progress}%"
                >
                </div>

            </div>

            <br>

            <p>
                ✅ Completed:
                ${completed}
            </p>

            <p>
                ⏳ Pending:
                ${total - completed}
            </p>

            <button
                onclick="deleteProject(${project.id})"
            >
                Delete
            </button>

        </div>

        `;

    });

}

async function createProject() {

    const title =
    document.getElementById(
        "projectTitle"
    ).value;

    const description =
    document.getElementById(
        "projectDescription"
    ).value;

    await fetch(
        "https://taskflow-backend-tmc5.onrender.com/api/projects",
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                title,
                description,
                createdBy:"Admin"

            })
        }
    );

    document.getElementById(
        "projectTitle"
    ).value = "";

    document.getElementById(
        "projectDescription"
    ).value = "";

    loadProjects();

}

async function deleteProject(id){

    const confirmDelete =
    confirm(
        "Delete this project?"
    );

    if(!confirmDelete){
        return;
    }

    await fetch(
        `https://taskflow-backend-tmc5.onrender.com/api/projects/${id}`,
        {
            method:"DELETE"
        }
    );

    loadProjects();

}

loadProjects();