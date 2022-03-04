const TaskManager = (() => {
  const taskEditor = document.getElementById("taskEditor");
  const addTaskBtn = document.getElementById("addTask-btn");
  const updateTaskBtn = document.getElementById("updateTask-btn");
  const filterContainer = document.getElementById("filterContainer");
  const listContainer = document.getElementById("listContainer");
  const projectListBtn = document.getElementById("projectList-btn");
  const deleteTaskBtn = document.getElementById("deleteTask-btn");

  // Using in creating tasks at first time entering the app
  const initTask = {
    priority: "Medium",
    dueDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    project: "myProject",
    title: "What you gonna make today",
    description:
      "Write it down, and maybe have some description to it. Also, you can add short notes, or checkbox to make things clearer 😁",
    completed: false,
  };

  // Create a container for all tasks
  const tasks = {
    tasks: {
      init: initTask,
    },
  };

  // Using in creating a new task
  function hash(task) {
    let hashValue = 0;
    const codeArr = Object.values(task)
      .toString()
      .split("")
      .map((c) => c.charCodeAt(0));
    for (let i = 0; i < codeArr.length; i += 1) {
      hashValue += parseInt(codeArr[i], 16) * (i + 1);
    }
    const idValue = `id${hashValue.toString()}`;
    return idValue;
  }

  function readTask(id, content) {
    // Hide homepage
    addTaskBtn.classList.toggle("dp-none");
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    projectListBtn.classList.toggle("dp-none");
    // Shoe task editor page
    updateTaskBtn.classList.toggle("dp-none");
    deleteTaskBtn.classList.toggle("dp-none");
    taskEditor.classList.toggle("dp-none");
    // Display the content of the task
    taskEditor.querySelector("#todoInput").value = content.title;
    taskEditor.querySelector("#todoInput").dataset.name = id;
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

  async function checkLocalStorage() {
    let todolist;
    try {
      todolist = await JSON.parse(localStorage.todolist);
    } catch (err) {
      localStorage.setItem("todolist", JSON.stringify(tasks));
      todolist = await JSON.parse(localStorage.getItem("todolist"));
      const hasInit = !!(await todolist.tasks.init);
      if (!hasInit) {
        throw new Error(`Something wrong while init, check: ${err}`);
      }
    }
    return todolist;
  }

  // While called by request of updating,
  // the prop makes sure that update executed
  async function createTasks() {
    const itemsList = await checkLocalStorage();
    if (await itemsList) {
      const taskItems = itemsList.tasks;
      Object.entries(taskItems).forEach((item) => {
        const [id, content] = item;
        // if (document.querySelector(`[data-name=${id}]`)) return;
        // If the item exists, pass this round
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
          readTask(id, content);
        });
        listContainer.appendChild(taskContainer);
      });
    }
  }

  // for preparing a blank task form only
  addTaskBtn.addEventListener("click", (e) => {
    // Hide homepage
    e.target.closest("#addTask-btn").classList.toggle("dp-none");
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    projectListBtn.classList.toggle("dp-none");
    // Shoe task editor page
    updateTaskBtn.classList.toggle("dp-none");
    taskEditor.classList.toggle("dp-none");
    deleteTaskBtn.classList.add("dp-none");
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

  updateTaskBtn.addEventListener("click", () => {
    const tasklist = new Promise((resolve, reject) => {
      resolve(JSON.parse(localStorage.getItem("todolist")));
      reject(new Error("something wrong when updating"));
    });
    tasklist
      .then((fullfilled) => {
        const taskId =
          taskEditor.querySelector("#todoInput").dataset.name ?? "addNewTask";
        const newList = fullfilled;
        const formContent = {
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
        deleteTaskBtn.classList.add("dp-none");
      });
  });

  deleteTaskBtn.addEventListener("click", () => {
    const tasklist = new Promise((resolve, reject) => {
      resolve(JSON.parse(localStorage.getItem("todolist")));
      reject(new Error("something wrong when deleting"));
    });
    tasklist
      .then((fullfilled) => {
        const taskId =
          taskEditor.querySelector("#todoInput").dataset.name ??
          "Error: id missing, check delete";
        const newList = fullfilled;
        if (taskId in newList.tasks) {
          delete newList.tasks[taskId];
        } else {
          throw new Error("id missing, check delete");
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
  return { createTasks };
})();

document.addEventListener("DOMContentLoaded", () => {
  TaskManager.createTasks();
});

export default TaskManager;
