import express from "express";
import connectDB from "./server/config/db.js";
import { notFound, errorHandler } from "./server/middleware/errorMiddleware.js";
import dotenv from "dotenv";
import todoRoutes from "./server/routes/todoRoutes.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import {
  createTodo,
  getTodos,
  deleteTodo,
  editTodo,
  completeTodo,
} from "./server/services/todo.js";
import path from "path";

// load env vairables
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(express.static("./client/build"));
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

server.listen(8080, () => {
  console.log("Socket.io läuft auf 8080");
});

io.on("connection", (socket) => {
  //listeing to the events from the client
  console.log("A user connected");

  socket.on("initial data", async () => {
    try {
      const todos = await getTodos();
      io.emit("get_data", { success: true, response: todos, error: {} });
    } catch (e) {
      io.emit("get_data", { success: false, response: {}, error: e });
    }
  });

  socket.on("create todo", async (todo) => {
    try {
      const result = await createTodo({ title: todo });
      io.emit("todo created", { success: true, response: result, error: {} });
    } catch (e) {
      io.emit("todo created", { success: false, response: {}, error: e });

      console.log("todo could not be created");
    }
  });

  socket.on("delete todo", async (todoID) => {
    try {
      const result = await deleteTodo(todoID);
      io.emit("todo deleted", { success: true, response: result, error: {} });
    } catch (e) {
      io.emit("todo deleted", { success: false, response: {}, error: e });

      console.log("todo could not be deleted");
    }
  });

  socket.on("update todo", async (todoID, todo) => {
    try {
      const result = await editTodo({ _id: todoID }, { title: todo });
      io.emit("todo updated", { success: true, response: result, error: {} });
    } catch (e) {
      io.emit("todo updated", { success: false, response: {}, error: e });

      console.log("todo could not be update");
    }
  });

  socket.on("completion todo", async (todoID, bool) => {
    try {
      const result = await completeTodo({ _id: todoID }, { completed: bool });
      io.emit("completion todo updated", {
        success: true,
        response: result,
        error: {},
      });
    } catch (e) {
      io.emit("completion todo updated", {
        success: false,
        response: {},
        error: e,
      });

      console.log("todo could not be completed");
    }
  });
});

// Routes
app.use("/api/todos", todoRoutes);
app.get("*", (req, res) => {
  res.sendFile("./client/build/index.html");
});

// Middleware
app.use(notFound);
app.use(errorHandler);

// Server listening
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\nServer listening on port ${PORT}`);
});
