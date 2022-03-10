import XSVG from "./icons/x.svg";
import folderPlusSVG from "./icons/folder-plus.svg";
import { showMsgPopUp, event } from "./PopUp";
import { addTaskBtn, filterContainer, projectListBtn } from "./UI";
import Storage from "./Storage";
import TaskManager from "./TaskManager";

const ProjectManager = (() => {
  const projectContainer = document.getElementById("projectContainer");
  const listContainer = document.getElementById("listContainer");
  const projectAddBtn = document.getElementById("projectAdd-btn");

  projectAddBtn.querySelector("img").src = folderPlusSVG;

  function removeProjectListItems() {
    const projectList = document.getElementById("projectList");
    if (projectList.children[0]) {
      projectList.removeChild(projectList.children[0]);
      removeProjectListItems();
    }
    return 0;
  }

  async function deleteProject(projectNode) {
    const projectId = projectNode.dataset.name;
    const todolist = await JSON.parse(localStorage.getItem("todolist"));
    const newList = await todolist;
    Object.values(newList.tasks).forEach((task) => {
      if (task.project === projectId) {
        // eslint-disable-next-line no-param-reassign
        task.project = "none";
      }
    });
    delete newList.projects[projectId];
    localStorage.clear();
    localStorage.setItem("todolist", JSON.stringify(newList));
    return 0;
  }

  async function createProjectList() {
    const todolist = await Storage.getTodolist();
    const projects = await todolist.projects;
    let counter = 1;
    Object.entries(projects).forEach((project) => {
      const [name] = project;
      let [, count] = project;
      Object.values(todolist.tasks).forEach((task) => {
        if (name === task.project) {
          count += 1;
        }
      });
      // if (document.querySelector(`[data-name=${id}]`)) return;
      // If the item exists, pass this round
      const projectItem = document.createElement("li");
      projectItem.classList.add("project-item");

      projectItem.innerHTML = `
            <p data-project>${counter}. ${name.toString()}</p>
            <div class="task-counter">
              <span>${count}</span>
              <div>task${count > 1 ? "s" : ""} in the project</div>
            </div>
            <div class="delete-sign">
              <img src="${XSVG}" alt="delete">
            </div>
          `;
      counter += 1;
      projectItem.dataset.name = name;
      projectItem
        .querySelector(".delete-sign")
        .addEventListener("click", () => {
          showMsgPopUp(
            `${count} task${count > 1 ? "s" : ""} will be set to Project: none`,
            false
          );
          event.fn = () => {
            Promise.resolve(deleteProject(projectItem)).then(() => {
              removeProjectListItems();
              createProjectList();
              TaskManager.clearList();
              TaskManager.createTasks();
            });
          };
        });
      projectContainer.querySelector("ol").appendChild(projectItem);
    });
  }

  async function addProject(name) {
    const todolist = await Storage.getTodolist();
    const { projects } = await todolist;
    if (name in (await projects)) {
      showMsgPopUp("Create a project", true, "the name has been used");
      return this;
    }
    if (name === false || !name.toString().trim()) {
      showMsgPopUp("Create a project", true, "Please enter a name");
      return this;
    }
    projects[name] = 0;
    const newList = todolist;
    newList.projects = projects;
    localStorage.clear();
    localStorage.setItem("todolist", JSON.stringify(newList));
    removeProjectListItems();
    createProjectList();
    return 0;
  }

  projectAddBtn.addEventListener("click", () => {
    showMsgPopUp("Create a project", true);
    // setter
    event.fn = addProject;
  });

  projectListBtn.addEventListener("click", () => {
    // Hide homepage
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    addTaskBtn.classList.toggle("dp-none");
    // Show project list
    projectContainer.classList.toggle("dp-none");
    projectAddBtn.classList.toggle("dp-none");
    // Clear project list, and recreate it
    removeProjectListItems();
    createProjectList();
  });
  return { createProjectList };
})();

export default ProjectManager;
