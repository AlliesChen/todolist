import TaskManager from "./TaskManager";
import ProjectManager from "./ProjectManager";
import Storage from "./Storage";
import UI from "./UI";

Promise.resolve(Storage.getTodolist()).then(() => {
  TaskManager.createTasks();
  ProjectManager.createProjectList();
});

document.addEventListener("DOMContentLoaded", () => {
  UI.colorBtns();
});
