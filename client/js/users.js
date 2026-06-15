async function loadMembers(){

    const response =
    await fetch(
        "http://localhost:5000/api/users"
    );

    const users =
    await response.json();

    const container =
    document.getElementById(
        "teamContainer"
    );

    container.innerHTML = "";

    users.forEach(user => {

        container.innerHTML += `

        <div class="member-card">

            <div class="member-avatar">

                ${user.name
                    .charAt(0)
                    .toUpperCase()}

            </div>

            <h2>
                ${user.name}
            </h2>

            <p class="role">
                ${user.role}
            </p>

            <button
                onclick="deleteMember(${user.id})"
                style="
                background:crimson;
                color:white;
                border:none;
                padding:10px;
                border-radius:8px;
                cursor:pointer;"
            >
                Remove
            </button>

        </div>

        `;

    });

}

async function addMember(){

    const name =
    document.getElementById(
        "memberName"
    ).value;

    const role =
    document.getElementById(
        "memberRole"
    ).value;

    if(!name || !role){

        alert(
            "Fill all fields"
        );

        return;

    }

    await fetch(
        "http://localhost:5000/api/users",
        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                name,
                role

            })

        }
    );

    document.getElementById(
        "memberName"
    ).value = "";

    document.getElementById(
        "memberRole"
    ).value = "";

    loadMembers();

}

async function deleteMember(id){

    await fetch(
        `http://localhost:5000/api/users/${id}`,
        {
            method:"DELETE"
        }
    );

    loadMembers();

}

loadMembers();