const input = document.getElementById("todoInput");
const insertButton = document.getElementById("insertButton");
const listUL = document.getElementById("listUL");

let todos = [];

const render = () => {
  let html = "";

  todos.forEach((todo) => {
    html += '<br><li class="'+(todo.completed ? "completed" : "")+'">'+ todo.name + '  <button class="btn btn-success" onclick="completeTodo">Complete</button> <button class="btn btn-danger" onclick="deleteTodo">Remove</button></li>'});

  listUL.innerHTML = html;
};

const send = (todo) => {
  return new Promise((resolve, reject) => {
    fetch("/todo/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json); // risposta del server all'aggiunta
      });
  });
};

const load = () => {
  return new Promise((resolve, reject) => {
    fetch("/todo")
      .then((response) => response.json())
      .then((json) => {
        resolve(json); // risposta del server con la lista
      });
  });
};

insertButton.onclick = () => {
  console.log("premuto");
  const todo = {
    name: todoInput.value,
    completed: false,
  };
  send({ todo: todo }) // 1. invia la nuova Todo
    .then(() => load()) // 2. caricala nuova lista
    .then((json) => {
      console.log(json);
      todos = json.todos;
      todoInput.value = "";
      render(); // 3. render della nuova lista
    });
};

load().then((json) => {
  todos = json.todos;
  render();
});

const completeTodo = (todo) => {
  return new Promise((resolve, reject) => {
    fetch("/todo/complete", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      });
  });
};

const deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    fetch("/todo/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      });
  });
};

setInterval(() => {
  load().then((json) => {
    todos = json.todos;
    todoInput.value = "";
    render();
  });
}, 30000);
