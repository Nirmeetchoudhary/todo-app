const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Load tasks from localStorage on start
document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener("click", addTask);

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return alert("Please enter a task!");

  const task = { id: Date.now(), text: taskText, done: false };
  saveTask(task);
  renderTask(task);

  taskInput.value = "";
}

// Save task to localStorage
function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render single task
function renderTask(task) {
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);

  // Left side: checkbox + text
  const leftDiv = document.createElement("div");
  leftDiv.classList.add("task-left");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.onchange = () => toggleDone(task.id);

  const span = document.createElement("span");
  span.textContent = task.text;
  if (task.done) span.classList.add("done");

  leftDiv.appendChild(checkbox);
  leftDiv.appendChild(span);

  // Right side: edit + delete
  const actions = document.createElement("div");
  actions.classList.add("actions");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit");
  editBtn.onclick = () => editTask(task.id);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete");
  deleteBtn.onclick = () => deleteTask(task.id);

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  // Append left + right into li
  li.appendChild(leftDiv);
  li.appendChild(actions);

  taskList.appendChild(li);
}


// Load all tasks
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => renderTask(task));
}

// Edit task
function editTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let task = tasks.find(t => t.id === id);

  // Find the <li> element of this task
  const li = document.querySelector(`li[data-id='${id}']`);
  const leftDiv = li.querySelector(".task-left");
  const actions = li.querySelector(".actions");

  // Clear left side
  leftDiv.innerHTML = "";

  // Create input field pre-filled with text
  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.classList.add("edit-input");

  leftDiv.appendChild(input);

  // Clear right side (remove edit/delete)
  actions.innerHTML = "";

  // Save button
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.classList.add("save");
  saveBtn.onclick = () => {
    if (input.value.trim() !== "") {
      task.text = input.value.trim();
      localStorage.setItem("tasks", JSON.stringify(tasks));
      refreshList();
    }
  };

  // Cancel button
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.classList.add("cancel");
  cancelBtn.onclick = () => refreshList();

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
}


// Delete task
function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  refreshList();
}

// ✅ Toggle Done (strike-through)
function toggleDone(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let task = tasks.find(t => t.id === id);
  task.done = !task.done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  refreshList();
}

// Refresh UI
function refreshList() {
  taskList.innerHTML = "";
  loadTasks();
}
