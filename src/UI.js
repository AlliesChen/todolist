import "./style.css";
import blueXSVG from "./icons/x--blue.svg";
import listSVG from "./icons/list.svg";
import plusSVG from "./icons/plus.svg";
import XSVG from "./icons/x.svg";
import checkSVG from "./icons/check-circle.svg";
import trashSVG from "./icons/trash-2.svg";

const taskEditor = document.getElementById("taskEditor");
const addTaskBtn = document.getElementById("addTask-btn");
const updateTaskBtn = document.getElementById("updateTask-btn");
const filterContainer = document.getElementById("filterContainer");
const listContainer = document.getElementById("listContainer");
const projectContainer = document.getElementById("projectContainer");
const projectListBtn = document.getElementById("projectList-btn");
const deleteTaskBtn = document.getElementById("deleteTask-btn");

addTaskBtn.querySelector("img").src = plusSVG;
projectListBtn.querySelector("img").src = listSVG;
updateTaskBtn.querySelector("img").src = checkSVG;
deleteTaskBtn.querySelector("img").src = trashSVG;
taskEditor.querySelector("#cancelEdit-btn > img").src = blueXSVG;

document.addEventListener("click", (e) => {
  filterContainer.querySelectorAll(".dropdown").forEach((dropdown) => {
    dropdown.classList.remove("active");
  });

  if (e.target.matches("[data-dropdown-display]")) {
    e.target.closest("#displayFilter").classList.toggle("active");
    return;
  }

  if (e.target.matches("[data-display-link]")) {
    e.target
      .closest("#displayFilter")
      .querySelector("[data-dropdown-display]").textContent =
      e.target.textContent;
  }

  if (e.target.matches("[data-dropdown-project]")) {
    e.target.closest("#projectFilter").classList.toggle("active");
    return;
  }
  if (e.target.matches("[data-project-link]")) {
    e.target
      .closest("#projectFilter")
      .querySelector("[data-dropdown-project]").textContent =
      e.target.textContent;
  }
});

taskEditor.addEventListener("click", (e) => {
  taskEditor.querySelectorAll(".dropdown").forEach((dropdown) => {
    dropdown.classList.remove("active");
  });

  if (e.target.matches("[data-dropdown-priority]")) {
    e.target.closest("#priorityMenu").classList.toggle("active");
    return;
  }
  if (e.target.matches("[data-priority-link]")) {
    e.target
      .closest("#priorityMenu")
      .querySelector("[data-dropdown-priority]").textContent =
      e.target.textContent;
  }

  if (e.target.matches("[data-dropdown-project]")) {
    e.target.closest("#projectMenu").classList.toggle("active");
    return;
  }
  if (e.target.matches("[data-project-link]")) {
    e.target
      .closest("#projectMenu")
      .querySelector("[data-dropdown-project]").textContent =
      e.target.textContent;
  }
});

taskEditor.querySelector("#cancelEdit-btn").addEventListener("click", () => {
  // Show homepage
  projectListBtn.classList.toggle("dp-none");
  filterContainer.classList.toggle("dp-none");
  listContainer.classList.toggle("dp-none");
  // Hide buttons for task editor
  taskEditor.classList.toggle("dp-none");
  addTaskBtn.classList.toggle("dp-none");
  updateTaskBtn.classList.toggle("dp-none");
  deleteTaskBtn.classList.add("dp-none");
});

taskEditor
  .querySelector("#markCompleted-btn")
  .addEventListener("click", (e) => {
    e.target.classList.toggle("mark");
    e.target.textContent = e.target.classList.contains("mark")
      ? "Completed"
      : "Mark Completed";
  });

async function getProjects() {
  try {
    const appList = await JSON.parse(localStorage.getItem("todolist"));
    appList.project = appList.project ?? { myProject: 0 };
    return appList.project;
  } catch (err) {
    throw new Error("todolist isn't exit");
  }
}

// While called by request of updating,
// the prop makes sure that update executed
async function createProjectList() {
  const projects = await getProjects();
  let counter = 1;
  Object.entries(projects).forEach((project) => {
    const [name, count] = project;
    // if (document.querySelector(`[data-name=${id}]`)) return;
    // If the item exists, pass this round
    const projectItem = document.createElement("li");
    projectItem.classList.add("project-item");

    projectItem.innerHTML = `
      <p data-project>${counter}. ${name.toString()}</p>
      <div class="task-counter">
        <span>${count}</span>
        <div>task in the project</div>
      </div>
      <img src="${XSVG}" alt="delete">
    `;
    counter += 1;
    projectItem.dataset.name = name;
    projectContainer.querySelector("ol").appendChild(projectItem);
  });
}

function removeProjectListItems() {
  const projectList = document.getElementById("projectList");
  if (projectList.children[0]) {
    projectList.removeChild(projectList.children[0]);
    removeProjectListItems();
  }
  return 0;
}

projectListBtn.addEventListener("click", () => {
  // Hide homepage
  filterContainer.classList.toggle("dp-none");
  listContainer.classList.toggle("dp-none");
  addTaskBtn.classList.toggle("dp-none");
  // Show project list
  projectContainer.classList.toggle("dp-none");
  // Clear project list, and recreate it
  removeProjectListItems();
  createProjectList();
});
