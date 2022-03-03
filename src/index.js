document.addEventListener("DOMContentLoaded", () => {
  const filterContainer = document.getElementById("filterContainer");
  const listContainer = document.getElementById("listContainer");
  const taskEditor = document.getElementById("taskEditor");
  const projectList = document.getElementById("projectList");
  const addTaskBtn = document.getElementById("addTask-btn");
  const projectListBtn = document.getElementById("projectList-btn");
  const updateTaskBtn = document.getElementById("updateTask-btn");
  const deleteTaskBtn = document.getElementById("deleteTask-btn");
  const mode = { entry: "" };

  const initTask = {
    init: {
      priority: "Medium",
      dueDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      project: "Project Name",
      title: "What you gonna make today",
      description:
        "Write it down, and maybe have some description to it. Also, you can add short notes, or checkbox to make things clearer 😁",
      completed: false,
    },
  };

  async function checkLocalStorage() {
    let todolist;
    try {
      todolist = await JSON.parse(localStorage.todolist);
    } catch (err) {
      localStorage.setItem("todolist", JSON.stringify(initTask));
      todolist = JSON.parse(localStorage.getItem("todolist"));
      const hasInit = !!(await todolist.init);
      if (!hasInit) {
        throw new Error(`Something wrong while init, check: ${err}`);
      }
    }
    return todolist;
  }

  function readTask(task) {
    const [id, content] = task;
    // Hide homepage
    addTaskBtn.classList.toggle("dp-none");
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    projectListBtn.classList.toggle("dp-none");
    // Shoe task editor page
    updateTaskBtn.classList.toggle("dp-none");
    deleteTaskBtn.classList.toggle("dp-none");
    taskEditor.classList.toggle("dp-none");
    // Setting entry
    mode.entry = id;
    // Display the content of the task
    taskEditor.querySelector("#todoInput").value = content.title;
    const date = new Date(content.dueDate);
    const [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    const editorFormatDate = `${year}-${
      month + 1 < 10 ? "0".concat(month + 1) : month
    }-${day < 10 ? "0".concat(day) : day}`;
    taskEditor.querySelector("#dueDateInput").value = editorFormatDate;

    taskEditor.querySelector("[data-dropdown-priority]").textContent =
      content.priority;

    taskEditor.querySelector("[data-dropdown-project]").textContent =
      content.project;

    taskEditor.querySelector("#descriptionInput").value = content.description;

    const { isCompleted } = content.completed;
    if (isCompleted === true) {
      const markCompletedBtn = taskEditor.querySelector("#markCompleted-btn");
      markCompletedBtn.textContent = "Completed";
      markCompletedBtn.classList.add("mark");
    }
  }

  async function createTasks() {
    const listItems = await checkLocalStorage();
    if (await listItems) {
      Object.entries(listItems).forEach((item) => {
        const [id, content] = item;
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container");

        taskContainer.innerHTML = `
          <div class="tag-container">
            <div class="priority">${content.priority}</div>
            <div class="due-date">${content.dueDate}</div>
            <div class="project">${content.project}</div>
          </div>
          <div class="info-container">
            <div class="title">${content.title}</div>
            <div class="description">${content.description}</div>
          </div>
        `;
        taskContainer.dataset.name = id;
        taskContainer.addEventListener("click", () => {
          readTask(item);
        });
        listContainer.appendChild(taskContainer);
      });
    }
  }

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

  addTaskBtn.addEventListener("click", (e) => {
    // Hide homepage
    e.target.closest("#addTask-btn").classList.toggle("dp-none");
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    projectListBtn.classList.toggle("dp-none");
    // Shoe task editor page
    updateTaskBtn.classList.toggle("dp-none");
    deleteTaskBtn.classList.toggle("dp-none");
    taskEditor.classList.toggle("dp-none");
    // Set entry
    mode.entry = "addNewTask";
    // Set the initial form
    // Priority
    taskEditor.querySelector("[data-dropdown-priority]").textContent = "none";
    // due date
    const date = new Date();
    const [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    const editorFormatDate = `${year}-${
      month + 1 < 10 ? "0".concat(month + 1) : month
    }-${day < 10 ? "0".concat(day) : day}`;
    taskEditor.querySelector("#dueDateInput").value = editorFormatDate;
    // project
    taskEditor.querySelector("[data-dropdown-project]").textContent = "none";
    // title
    taskEditor.querySelector("#todoInput").value = "";
    // description
    taskEditor.querySelector("#descriptionInput").value = "";
    // status
    taskEditor.querySelector("#markCompleted-btn").classList.remove("mark");
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
    deleteTaskBtn.classList.toggle("dp-none");
  });

  projectListBtn.addEventListener("click", () => {
    // Hide homepage
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    addTaskBtn.classList.toggle("dp-none");
    // Show project list
    projectList.classList.toggle("dp-none");
  });

  taskEditor
    .querySelector("#markCompleted-btn")
    .addEventListener("click", (e) => {
      e.target.classList.toggle("mark");
      e.target.textContent = e.target.classList.contains("mark")
        ? "Completed"
        : "Mark Completed";
    });

  function hash(string) {
    let hashValue = 0;
    const codeArr = string
      .toString()
      .split("")
      .map((c) => c.charCodeAt(0));
    for (let i = 0; i < codeArr.length; i += 1) {
      hashValue += parseInt(codeArr[i], 10) * i;
    }
    const idValue = `id${hashValue.toString()}`;
    return idValue;
  }

  updateTaskBtn.addEventListener("click", () => {
    const tasklist = new Promise((resolve, reject) => {
      resolve(JSON.parse(localStorage.getItem("todolist")));
      reject(new Error("something wrong when updating"));
    });
    tasklist
      .then((fullfilled) => {
        const newList = fullfilled;
        if (mode.entry in fullfilled) {
          // enter with existed tasks
          const task = newList[mode.entry];
          // read and update task info from the form
          // priority
          task.priority = taskEditor.querySelector(
            "[data-dropdown-priority]"
          ).textContent;
          // due date
          task.dueDate = new Date(
            taskEditor.querySelector("#dueDateInput").value
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          // project
          task.project = taskEditor.querySelector(
            "[data-dropdown-project]"
          ).textContent;
          // title
          task.title = taskEditor.querySelector("#todoInput").value;
          // description
          task.description =
            taskEditor.querySelector("#descriptionInput").value;
          // status
          task.completed = taskEditor
            .querySelector("#markCompleted-btn")
            .classList.contains("mark");
        } else if (mode.entry === "addNewTask") {
          // enter with add new task button
          const newTaskId = hash(taskEditor.querySelector("#todoInput").value);
          newList[newTaskId] = {
            priority: taskEditor.querySelector("[data-dropdown-priority]")
              .textContent,
            dueDate: new Date(
              taskEditor.querySelector("#dueDateInput").value
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            project: taskEditor.querySelector("[data-dropdown-project]")
              .textContent,
            title: taskEditor.querySelector("#todoInput").value,
            description: taskEditor.querySelector("#descriptionInput").value,
            completed: taskEditor
              .querySelector("#markCompleted-btn")
              .classList.contains("mark"),
          };
        } else {
          throw new Error("the entry of the task doesn't exit");
        }
        // Remove all the tasks
        listContainer.querySelectorAll(".task-container").forEach((task) => {
          listContainer.removeChild(task);
        });
        // Reload the updated info to localStorage
        localStorage.removeItem("todolist");
        localStorage.setItem("todolist", JSON.stringify(newList));
      })
      .then(() => {
        createTasks();
        // Show homepage
        projectListBtn.classList.toggle("dp-none");
        filterContainer.classList.toggle("dp-none");
        listContainer.classList.toggle("dp-none");
        // Hide buttons for task editor
        taskEditor.classList.toggle("dp-none");
        addTaskBtn.classList.toggle("dp-none");
        updateTaskBtn.classList.toggle("dp-none");
        deleteTaskBtn.classList.toggle("dp-none");
      });
  });
  createTasks();
});
