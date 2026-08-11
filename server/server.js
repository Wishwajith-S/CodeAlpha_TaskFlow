const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("TaskFlow Backend Running...");
});

io.on("connection", (socket) => {

    console.log(
        "User Connected:",
        socket.id
    );

    socket.on("taskChanged", () => {

        io.emit("taskUpdated");

    });

    socket.on("disconnect", () => {

        console.log(
            "User Disconnected:",
            socket.id
        );

    });

});

app.set("io", io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});