import { showMsgPopUp, event } from "./PopUp";
import UI, {
  taskEditor,
  addTaskBtn,
  updateTaskBtn,
  filterContainer,
  projectListBtn,
  deleteTaskBtn,
  listContainer,
} from "./UI";
import Storage, { hash, dateMaker } from "./Storage";
import Filter from "./Fliter";

const TaskManager = (() => {
  async function setProjectList() {
    const projectDopdown = document.querySelector(
      "#projectMenu > .dropdown-menu"
    );
    const todolist = await Storage.getTodolist();
    while (projectDopdown.children[0]) {
      projectDopdown.removeChild(projectDopdown.children[0]);
    }
    Object.keys(todolist.projects).forEach((projectName) => {
      const dropdownItem = document.createElement("p");
      dropdownItem.classList.add("dropdown-link");
      dropdownItem.dataset.projectLink = projectName;
      dropdownItem.textContent = projectName;
      projectDopdown.appendChild(dropdownItem);
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
    setProjectList();
    return 0;
  }

  // Action of the add project button in the task editor
  document
    .querySelector("#projectMenu + button")
    .addEventListener("click", () => {
      showMsgPopUp("Create a project", true);
      // setter
      event.fn = addProject;
    });

  function readTask(id, content) {
    UI.setTaskEditorPage();
    setProjectList();
    const {
      priorityEl,
      dueDateEl,
      projectEl,
      titleEl,
      descriptionEl,
      completedEl,
    } = UI.getFormElement();
    const { priority, dueDate, project, title, description, completed } =
      content;
    // Display the content of the task
    // priority
    priorityEl.textContent = priority;
    // dueDate
    dueDateEl.value = dateMaker(dueDate);
    // project
    projectEl.textContent = project;
    // title
    titleEl.value = title;
    titleEl.dataset.name = id;
    // description
    descriptionEl.value = description;
    // status
    if (completed === true) {
      completedEl.textContent = "Completed";
      completedEl.classList.add("mark");
    }
    UI.colorBtns();
  }

  async function createTasks() {
    const itemsList = await Storage.getTodolist();
    // if (await itemsList)
    try {
      const taskItems = itemsList.tasks;
      Object.entries(taskItems).forEach((item) => {
        const [id, content] = item;
        const taskContainer = document.createElement("div");
        const description =
          // fold description if it's too long
          content.description.length > 71
            ? content.description.slice(0, 71).concat("...")
            : content.description;
        const priorityIsNone = content.priority === "none" ? "dp-none" : "";
        const projectIsNone = content.project === "none" ? "dp-none" : "";
        taskContainer.classList.add("task-container");
        taskContainer.innerHTML = `
          <div class="tag-container" data-color="${content.priority}">
            <div class="priority ${priorityIsNone}">${content.priority}</div>
            <div class="due-date">${content.dueDate}</div>
            <div class="project ${projectIsNone}">${content.project}</div>
          </div>
          <div class="info-container">
            <div class="title">${content.title}</div>
            <div class="description">${description}</div>
          </div>
        `;
        taskContainer.dataset.name = id;
        taskContainer.dataset.status = content.completed;
        taskContainer.addEventListener("click", () => {
          readTask(id, content);
        });
        listContainer.appendChild(taskContainer);
      });
      Filter.filterTasks();
      Filter.sortTasks();
    } catch (err) {
      throw new Error(err);
    }
  }

  function clearList() {
    // Remove all the tasks
    listContainer.querySelectorAll(".task-container").forEach((task) => {
      listContainer.removeChild(task);
    });
  }

  function showHomePage(newList) {
    // Show homepage
    projectListBtn.classList.toggle("dp-none");
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    // Hide buttons for task editor
    taskEditor.classList.toggle("dp-none");
    addTaskBtn.classList.toggle("dp-none");
    updateTaskBtn.classList.toggle("dp-none");
    deleteTaskBtn.classList.add("dp-none");
    // Remove all the tasks
    clearList();
    // Reload the updated info to localStorage
    localStorage.removeItem("todolist");
    localStorage.setItem("todolist", JSON.stringify(newList));
    createTasks();
  }

  // for preparing a blank task form only
  addTaskBtn.addEventListener("click", () => {
    UI.setTaskEditorPage("add");
    setProjectList();
    const {
      priorityEl,
      dueDateEl,
      projectEl,
      titleEl,
      descriptionEl,
      completedEl,
    } = UI.getFormElement();
    // Priority
    taskEditor
      .querySelector("#priorityMenu")
      .setAttribute("data-color", "default");
    priorityEl.textContent = "none";
    // due date
    dueDateEl.value = dateMaker(Date.now());
    // project
    taskEditor
      .querySelector("#projectMenu")
      .setAttribute("data-color", "default");
    projectEl.textContent = "none";
    // title
    titleEl.value = "";
    // Task ID
    titleEl.dataset.name = "addNewTask";
    // description
    descriptionEl.value = "";
    // status
    completedEl.classList.remove("mark");
  });

  updateTaskBtn.addEventListener("click", () => {
    const tasklist = new Promise((resolve, reject) => {
      resolve(Storage.getTodolist());
      reject(new Error("something wrong when updating"));
    });
    tasklist.then((fullfilled) => {
      const newList = fullfilled;
      const taskId = taskEditor.querySelector("#todoInput").dataset.name;
      const {
        priorityEl,
        dueDateEl,
        projectEl,
        titleEl,
        descriptionEl,
        completedEl,
      } = UI.getFormElement();
      const formContent = {
        priority: priorityEl.textContent,
        dueDate: new Date(dueDateEl.value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        project: projectEl.textContent,
        title: titleEl.value,
        description: descriptionEl.value,
        completed: completedEl.classList.contains("mark"),
      };
      const newTaskId = hash(formContent);
      if (taskId in newList.tasks) {
        delete newList.tasks[taskId];
        newList.tasks[newTaskId] = formContent;
      } else if (taskId === "addNewTask") {
        // enter with add new task button
        newList.tasks[newTaskId] = formContent;
      } else {
        throw new Error("the entry of the task doesn't exit");
      }
      showHomePage(newList);
    });
  });

  async function deleteTask() {
    const taskList = await Storage.getTodolist();
    const newList = await taskList;
    const taskId = taskEditor.querySelector("#todoInput").dataset.name;
    if (taskId in newList.tasks) {
      delete newList.tasks[taskId];
    } else {
      throw new Error("id missing, check delete");
    }
    showHomePage(await newList);
  }

  function triggerPopUp() {
    // infoMsg, useInput?, errMsg
    showMsgPopUp("Delete cannot undo", false);
    event.fn = deleteTask;
  }

  deleteTaskBtn.addEventListener("click", triggerPopUp);

  return { createTasks, clearList };
})();

export default TaskManager;
