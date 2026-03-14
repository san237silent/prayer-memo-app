const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const clearButton = document.getElementById("clearButton");
const taskList = document.getElementById("taskList");
const statusText = document.getElementById("statusText");

let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");

  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = [];
  }
}

function updateStatus() {
  const total = tasks.length;
  const done = tasks.filter(task => task.done).length;
  statusText.textContent = `전체 ${total}개 / 완료 ${done}개`;
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.done) {
      li.classList.add("done");
    }

    const leftDiv = document.createElement("div");
    leftDiv.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    checkbox.addEventListener("change", function () {
      tasks[index].done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.className = "delete-btn";

    deleteButton.addEventListener("click", function () {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    li.appendChild(leftDiv);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  });

  updateStatus();
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("할 일을 입력해 주세요.");
    return;
  }

  tasks.push({
    text: text,
    done: false
  });

  taskInput.value = "";
  taskInput.focus();

  saveTasks();
  renderTasks();
}

function clearAllTasks() {
  const ok = confirm("정말 전체 삭제하시겠습니까?");
  if (!ok) return;

  tasks = [];
  saveTasks();
  renderTasks();
}

addButton.addEventListener("click", addTask);
clearButton.addEventListener("click", clearAllTasks);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

loadTasks();
renderTasks();