import "./style.css";
import blueXSVG from "./icons/x--blue.svg";
import listSVG from "./icons/list.svg";
import plusSVG from "./icons/plus.svg";
import checkSVG from "./icons/check-circle.svg";
import trashSVG from "./icons/trash-2.svg";

const taskEditor = document.getElementById("taskEditor");
const addTaskBtn = document.getElementById("addTask-btn");
const updateTaskBtn = document.getElementById("updateTask-btn");
const filterContainer = document.getElementById("filterContainer");
const listContainer = document.getElementById("listContainer");
const projectListBtn = document.getElementById("projectList-btn");
const deleteTaskBtn = document.getElementById("deleteTask-btn");

const UI = (() => {
  addTaskBtn.querySelector("img").src = plusSVG;
  projectListBtn.querySelector("img").src = listSVG;
  updateTaskBtn.querySelector("img").src = checkSVG;
  deleteTaskBtn.querySelector("img").src = trashSVG;
  taskEditor.querySelector("#cancelEdit-btn > img").src = blueXSVG;

  function setTaskEditorPage() {
    // Hide homepage
    addTaskBtn.classList.toggle("dp-none");
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    projectListBtn.classList.toggle("dp-none");
    // Shoe task editor page
    updateTaskBtn.classList.toggle("dp-none");
    deleteTaskBtn.classList.toggle("dp-none");
    taskEditor.classList.toggle("dp-none");
    return 0;
  }

  function getFormElement() {
    const formElement = {
      priorityEl: taskEditor.querySelector("[data-dropdown-priority]"),
      dueDateEl: taskEditor.querySelector("#dueDateInput"),
      projectEl: taskEditor.querySelector("[data-dropdown-project]"),
      titleEl: taskEditor.querySelector("#todoInput"),
      descriptionEl: taskEditor.querySelector("#descriptionInput"),
      completedEl: taskEditor.querySelector("#markCompleted-btn"),
    };
    return formElement;
  }

  filterContainer.addEventListener("click", (e) => {
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
    filterContainer.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
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
      const priorityBtn = e.target
        .closest("#priorityMenu")
        .querySelector("[data-dropdown-priority]");
      priorityBtn.textContent = e.target.textContent;
      priorityBtn.dataset.priority = e.target.textContent;
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
  return { setTaskEditorPage, getFormElement };
})();

export default UI;

export {
  taskEditor,
  addTaskBtn,
  updateTaskBtn,
  filterContainer,
  listContainer,
  projectListBtn,
  deleteTaskBtn,
};
