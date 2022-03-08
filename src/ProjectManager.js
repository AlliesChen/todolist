import XSVG from "./icons/x.svg";
import folderPlusSVG from "./icons/folder-plus.svg";

const ProjectManager = (() => {
  const projectContainer = document.getElementById("projectContainer");
  const projectListBtn = document.getElementById("projectList-btn");
  const filterContainer = document.getElementById("filterContainer");
  const listContainer = document.getElementById("listContainer");
  const addTaskBtn = document.getElementById("addTask-btn");
  const projectAddBtn = document.getElementById("projectAdd-btn");
  const popUp = document.getElementById("popUp");

  projectAddBtn.querySelector("img").src = folderPlusSVG;

  function showMsgPopUp(msg, useInput, err) {
    popUp.classList.remove("dp-none");
    popUp.querySelector("label").textContent = msg;
    if (useInput) {
      popUp.querySelector("input").classList.remove("dp-none");
    }
    if (err) {
      if (popUp.querySelector("[data-err]")) {
        const childNode = popUp.querySelector("[data-err]");
        popUp.querySelector("[data-form]").removeChild(childNode);
      }
      const hint = document.createElement("p");
      hint.textContent = err;
      hint.dataset.err = true;
      popUp
        .querySelector("[data-form]")
        .insertBefore(hint, popUp.querySelector("[data-buttons]"));
    }
    return 0;
  }

  function usePopUpMsg(callback) {
    popUp.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.matches("#popUp") || e.target.matches(".warning")) {
        popUp.classList.add("dp-none");
        popUp.querySelector("input").value = "";
        if (popUp.querySelector("[data-err]")) {
          const childNode = popUp.querySelector("[data-err]");
          popUp.querySelector("[data-form]").removeChild(childNode);
        }
        return false;
      }
      if (e.target.matches(".success")) {
        popUp.classList.add("dp-none");
        const popUpValue = popUp.querySelector("input").value ?? true;
        popUp.querySelector("input").value = "";
        callback(popUpValue);
      }
      return this;
    });
  }

  async function addProject(name) {
    const todolist = await JSON.parse(localStorage.getItem("todolist"));
    const { project } = await todolist;
    if (name in (await project)) {
      showMsgPopUp("Create a project", true, "the name has been used");
    }
    if (!name) {
      showMsgPopUp("Create a project", true, "Please enter a name");
    }
  }

  projectAddBtn.addEventListener("click", () => {
    showMsgPopUp("Create a project", true);
    usePopUpMsg(addProject);
  });

  async function getProjects() {
    try {
      const appList = await JSON.parse(localStorage.getItem("todolist"));
      if (!(await appList.project)) {
        appList.project = { myProject: 0 };
        localStorage.setItem("todolist", JSON.stringify(appList));
        getProjects();
      }
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
    projectAddBtn.classList.toggle("dp-none");
    // Clear project list, and recreate it
    removeProjectListItems();
    createProjectList();
  });
})();

export default ProjectManager;
