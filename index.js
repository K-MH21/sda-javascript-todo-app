// write logic here
document.body.style.backgroundColor = "#121212";
document.body.style.color = "#ffffff";

function styleButton(button) {
  const addButtonBackgroundColor = "#0066ff";
  button.style.backgroundColor = addButtonBackgroundColor;
  button.style.color = "#ffffff";
  button.style.border = "none";
  button.style.padding = "10px 20px";
  button.style.cursor = "pointer";
  button.addEventListener(
    "mouseenter",
    () => (button.style.backgroundColor = "#0052cc")
  );

  button.addEventListener(
    "mouseleave",
    () => (button.style.backgroundColor = addButtonBackgroundColor)
  );
  button.addEventListener("click", function () {
    button.style.backgroundColor = "#0D47A1";
    setTimeout(() => {
      button.style.backgroundColor = "#1E88E5";
    }, 150);
  });
}

function updateCounter() {
  if (numberOfCompletedTasks)
    completedTasksTitle.textContent = `Completed tasks (${numberOfCompletedTasks})`;
  else completedTasksTitle.textContent = `Completed tasks`;
  if (numberOfPendingTasks)
    pendingTasksTitle.textContent = `Pending tasks (${numberOfPendingTasks})`;
  else pendingTasksTitle.textContent = `Pending tasks`;
}

// 1.1 Adding a todo:

// Display an input field where users can enter a new todo item.
const inputElement = document.createElement("input");
inputElement.type = "text";
inputElement.placeholder = "Enter a task";
inputElement.style.backgroundColor = "#333";
inputElement.style.color = "#fff";
inputElement.style.border = "1px solid #444";
inputElement.style.padding = "10px";
inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask();
});
document.body.appendChild(inputElement);

// Include an "Add" button to add the entered todo item to the list.
const AddButton = document.createElement("button");
AddButton.textContent = "Click Me";
styleButton(AddButton);
AddButton.addEventListener("click", () => addTask());
document.body.appendChild(AddButton);

// 1.2 Rendering Todo List:
const tasksList = document.createElement("div");
tasksList.style.display = "flex";
tasksList.style.flexDirection = "column";
tasksList.style.gap = "20px";
document.body.appendChild(tasksList);

const pendingTasks = document.createElement("div");
pendingTasks.style.border = "1px solid #444";
pendingTasks.style.padding = "10px";
const pendingTasksTitle = document.createElement("h2");
pendingTasksTitle.textContent = "Pending tasks";
pendingTasks.appendChild(pendingTasksTitle);

const completedTasks = document.createElement("div");
completedTasks.style.border = "1px solid #444";
completedTasks.style.padding = "10px";
const completedTasksTitle = document.createElement("h2");
completedTasksTitle.textContent = "Completed tasks";
completedTasks.appendChild(completedTasksTitle);

tasksList.appendChild(pendingTasks);
tasksList.appendChild(completedTasks);

let numberOfPendingTasks = 0;
let numberOfCompletedTasks = 0;
// Render the list of todos on the screen.
function addTask() {
  let enteredTask = inputElement.value.trim();
  if (!enteredTask) {
    alert("You did not write anything");
    return;
  }
  addTaskToDOM(enteredTask, false);
  addTaskToLocalStorage(enteredTask, false);
  inputElement.value = "";
}

function addTaskToDOM(enteredTask, isCompleted) {
  const taskContainer = document.createElement("div");
  taskContainer.style.display = "flex";
  taskContainer.style.alignItems = "center";
  taskContainer.style.justifyContent = "space-between";
  taskContainer.style.padding = "10px";
  taskContainer.style.marginBottom = "5px";
  taskContainer.style.borderBottom = "1px solid #444";

  // Each todo item should display a checkbox and the task description.
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;

  // 1.3 Completing a Todo:
  // When a checkbox is clicked, mark the corresponding todo item as complete.
  // Visually indicate the completion status of each todo item.
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      taskDescription.style.textDecoration = "line-through";
      taskDescription.style.color = "#888";
      completedTasks.insertBefore(taskContainer, completedTasks.childNodes[1]);
      numberOfPendingTasks--;
      numberOfCompletedTasks++;
      moveTaskInLocalStorage(taskDescription.textContent, true);
    } else {
      taskDescription.style.textDecoration = "none";
      taskDescription.style.color = "#fff";
      pendingTasks.insertBefore(taskContainer, pendingTasks.childNodes[1]);
      numberOfPendingTasks++;
      numberOfCompletedTasks--;
      moveTaskInLocalStorage(taskDescription.textContent, false);
    }
    updateCounter();
  });
  taskContainer.appendChild(checkbox);

  const taskDescription = document.createElement("span");
  taskDescription.textContent = enteredTask;
  taskDescription.style.marginLeft = "10px";
  taskDescription.style.borderLeft = "1px solid #444";
  taskDescription.style.paddingLeft = "10px";
  if (isCompleted) {
    taskDescription.style.textDecoration = "line-through";
    taskDescription.style.color = "#888";
  }
  taskContainer.appendChild(taskDescription);

  // 2.1 Editing a Todo:
  // Implement an "Edit" button next to each todo item.
  // When the button is clicked, allow users to update the task description of the corresponding todo.
  const taskEditButton = document.createElement("button");
  taskEditButton.textContent = "Edit";
  taskEditButton.addEventListener("click", function () {
    const newTaskDescription = prompt(
      "Edit your task:",
      taskDescription.textContent
    );
    if (newTaskDescription !== null && newTaskDescription.trim() !== "") {
      if (checkbox.checked) {
        removeTaskFromLocalStorage(taskDescription.textContent, true);
        addTaskToLocalStorage(newTaskDescription, true);
      } else {
        removeTaskFromLocalStorage(taskDescription.textContent, false);
        addTaskToLocalStorage(newTaskDescription, false);
      }
      taskDescription.textContent = newTaskDescription;
    }
  });
  styleButton(taskEditButton);
  taskEditButton.style.marginLeft = "auto";
  taskContainer.appendChild(taskEditButton);

  // 1.4 Deleting a Todo:
  // Implement a "Delete" button next to each todo item.
  // When the button is clicked, remove the corresponding todo item from the list.
  const taskDeleteButton = document.createElement("button");
  taskDeleteButton.textContent = "Delete";
  taskDeleteButton.addEventListener("click", () => {
    taskContainer.remove();
    if (checkbox.checked) {
      numberOfCompletedTasks--;
      removeTaskFromLocalStorage(taskDescription.textContent, true);
    } else {
      numberOfPendingTasks--;
      removeTaskFromLocalStorage(taskDescription.textContent, false);
    }
    updateCounter();
  });
  styleButton(taskDeleteButton);
  taskDeleteButton.style.marginLeft = "10px";
  taskDeleteButton.style.borderLeft = "1px solid #444";
  taskDeleteButton.style.paddingLeft = "10px";
  taskContainer.appendChild(taskDeleteButton);

  if (isCompleted) {
    completedTasks.insertBefore(taskContainer, completedTasks.childNodes[1]);
    numberOfCompletedTasks++;
  } else {
    pendingTasks.insertBefore(taskContainer, pendingTasks.childNodes[1]);
    numberOfPendingTasks++;
  }

  updateCounter();
}

function addTaskToLocalStorage(taskDescription, isCompleted) {
  const key = isCompleted ? "completed" : "pending";
  let tasksArray = JSON.parse(localStorage.getItem(key)) || [];
  tasksArray.push(taskDescription);
  localStorage.setItem(key, JSON.stringify(tasksArray));
}

function removeTaskFromLocalStorage(taskDescription, isCompleted) {
  const key = isCompleted ? "completed" : "pending";
  let tasksArray = JSON.parse(localStorage.getItem(key)) || [];
  tasksArray = tasksArray.filter((task) => task !== taskDescription);
  localStorage.setItem(key, JSON.stringify(tasksArray));
}

function moveTaskInLocalStorage(taskDescription, isCompleted) {
  removeTaskFromLocalStorage(taskDescription, !isCompleted);
  addTaskToLocalStorage(taskDescription, isCompleted);
}

function loadTasksFromLocalStorage() {
  const pendingTasksArray = JSON.parse(localStorage.getItem("pending")) || [];
  const completedTasksArray =
    JSON.parse(localStorage.getItem("completed")) || [];
  pendingTasksArray.forEach((taskDescription) => {
    addTaskToDOM(taskDescription, false); // false means it's pending
  });
  completedTasksArray.forEach((taskDescription) => {
    addTaskToDOM(taskDescription, true); // true means it's completed
  });
}
loadTasksFromLocalStorage();
