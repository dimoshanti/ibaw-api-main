import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
  TextField,
  Box,
  List,
  ListItem,
  IconButton,
  ListItemText,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { AddToQueueOutlined, Create, Delete, Edit } from "@material-ui/icons";
import React, { useState, useEffect, useContext } from "react";
import useStyles from "./styles";
import "./App.css";
import { SocketContext } from "./context/socket";

const App = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [todoId, setTodoId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const socket = useContext(SocketContext);
  const uncompletedTodos = todos.filter((todo) => todo.completed === false);
  const completedTodos = todos.filter((todo) => todo.completed === true);
  console.log(completedTodos);
  console.log(uncompletedTodos);
  useEffect(() => {
    socket.emit("initial data"); //sending an event to the server
    socket.on("get_data", loadData); //listening to the events from the server

    socket.on("todo created", function (todo) {
      if (todo?.success === true) {
        setTodos((todos) => [...todos, todo?.response]);
      } else {
        const { error } = todo;
        setErrorMsg(error.message);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("todo deleted", function (todoResponse) {
      const { success, response, error } = todoResponse;
      if (success === true) {
        if (todos.length !== 0) {
          setTodos(todos.filter((item) => item._id !== response._id));
        }
      } else {
        setErrorMsg(error?.message);
      }
    });
  }, [todos]);

  useEffect(() => {
    socket.on("todo updated", function (todo) {
      const { success, response, error } = todo;

      if (success === true) {
        if (todos.length !== 0) {
          let updatedTodos = todos.map((item) => {
            if (item._id === response._id) {
              item.title = response.title;
            }
            return item;
          });
          setTodos(updatedTodos);
        }
      } else {
        setErrorMsg(error.message);
      }
    });
  }, [todos]);

  useEffect(() => {
    socket.on("completion todo updated", function (todo) {
      const { success, response, error } = todo;
      if (success === true) {
        if (todos.length !== 0) {
          let updatedTodos = todos.map((item) => {
            if (item._id === response._id) {
              item.completed = response.completed;
            }
            return item;
          });
          setTodos(updatedTodos);
        }
      } else {
        setErrorMsg(error.message);
      }
    });
  }, [todos]);

  const loadData = (e) => {
    if (e?.success === true) {
      setTodos(e.response);
    } else {
      const { error } = e;
      setErrorMsg(error.message);
      setTodos([]);
    }
  };

  const classes = useStyles();

  const addTodo = () => {
    socket.emit("create todo", todo);
    setTodo("");
  };

  const updateTodo = () => {
    socket.emit("update todo", todoId, todo);

    setTodo("");
    setTodoId("");
    setIsEdit(false);
  };

  const deleteTodo = (id) => {
    socket.emit("delete todo", id);
  };

  const setEdit = (id, title) => {
    setIsEdit(!isEdit);
    setTodoId(id);
    setTodo(title);
  };

  const submitTodo = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const taskCompletion = (todoId, e) => {
    socket.emit("completion todo", todoId, e.target.checked);
  };

  useEffect(() => {
    if (errorMsg !== "") {
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  }, [errorMsg]);

  console.log(todos);

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Create className={classes.icon} />
          <Typography variant="h6">IBAW ToDo-Liste</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className="todo-form">
          <TextField
            id="outlined-basic"
            label="Task"
            variant="outlined"
            className="todo-form--field"
            onChange={(e) => {
              setTodo(e.target.value);
            }}
            value={todo}
            onKeyPress={(e) => submitTodo(e)}
          />

          {isEdit ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateTodo()}
            >
              UPDATE
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => addTodo()}
            >
              ADD
            </Button>
          )}
        </div>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <div className="list-container">
          <Grid item xs={12} md={6}>
            <Typography
              sx={{ mt: 4, mb: 2 }}
              style={{ marginLeft: "20px" }}
              variant="h6"
              component="div"
            >
              Aufgaben
            </Typography>
            <div className="list-tasks">
              <List dense={false}>
                {uncompletedTodos.length > 0
                  ? uncompletedTodos.map((item, index) => {
                      return (
                        <ListItem key={index}>
                          <ListItemText primary={item.title} />
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={(e) => taskCompletion(item._id, e)}
                          />
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => setEdit(item._id, item.title)}
                          >
                            <Edit className={classes.icon} />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteTodo(item._id)}
                          >
                            <Delete
                              className={classes.icon}
                              style={{ color: "red" }}
                            />
                          </IconButton>
                        </ListItem>
                      );
                    })
                  : null}
              </List>
            </div>
            <Typography
              sx={{ mt: 4, mb: 2, ml: 6 }}
              variant="h6"
              style={{ marginLeft: "20px" }}
              component="div"
            >
              Erledigte Aufgaben
            </Typography>
            <div className="list-tasks-done">
              <List dense={false}>
                {completedTodos.length > 0
                  ? completedTodos.map((item, index) => {
                      return (
                        <ListItem key={index}>
                          <ListItemText primary={item.title} />

                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteTodo(item._id)}
                          >
                            <Delete
                              className={classes.icon}
                              style={{
                                color: "red",
                              }}
                            />
                          </IconButton>
                        </ListItem>
                      );
                    })
                  : null}
              </List>
            </div>
          </Grid>
        </div>
      </main>
    </>
  );
};

export default App;
