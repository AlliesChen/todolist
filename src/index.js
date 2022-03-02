document.addEventListener("DOMContentLoaded", () => {
  const filterContainer = document.getElementById("filterContainer");
  const listContainer = document.getElementById("listContainer");
  const taskEditor = document.getElementById("taskEditor");
  const projectList = document.getElementById("projectList");
  const taskEditorBtn = document.getElementById("taskEditor-btn");
  const projectListBtn = document.getElementById("projectList-btn");
  const updateTaskBtn = document.getElementById("updateTask-btn");
  const deleteTaskBtn = document.getElementById("deleteTask-btn");
  const markCompletedBtn = document.getElementById("markCompleted-btn");

  document.addEventListener("click", (e) => {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
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

  taskEditorBtn.addEventListener("click", (e) => {
    // Hide homepage
    e.target.closest("#taskEditor-btn").classList.toggle("dp-none");
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    projectListBtn.classList.toggle("dp-none");
    // Shoe task editor page
    updateTaskBtn.classList.toggle("dp-none");
    deleteTaskBtn.classList.toggle("dp-none");
    taskEditor.classList.toggle("dp-none");
  });

  taskEditor.querySelector("#cancelEdit-btn").addEventListener("click", () => {
    // Show homepage
    projectListBtn.classList.toggle("dp-none");
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    // Hide buttons for task editor
    taskEditor.classList.toggle("dp-none");
    taskEditorBtn.classList.toggle("dp-none");
    updateTaskBtn.classList.toggle("dp-none");
    deleteTaskBtn.classList.toggle("dp-none");
  });

  projectListBtn.addEventListener("click", (e) => {
    // Hide homepage
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    taskEditorBtn.classList.toggle("dp-none");
    // Show project list
    projectList.classList.toggle("dp-none");
  });

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
    },
  };

  function readTask(task) {
    // Hide homepage
    taskEditorBtn.classList.toggle("dp-none");
    filterContainer.classList.toggle("dp-none");
    listContainer.classList.toggle("dp-none");
    projectListBtn.classList.toggle("dp-none");
    // Shoe task editor page
    updateTaskBtn.classList.toggle("dp-none");
    deleteTaskBtn.classList.toggle("dp-none");
    taskEditor.classList.toggle("dp-none");
    // Display the content of the task
    taskEditor.querySelector("#todoInput").value =
      task.querySelector(".title").textContent;
    const date = new Date(task.querySelector(".due-date").textContent);
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
      task.querySelector(".priority").textContent;

    taskEditor.querySelector("[data-dropdown-project]").textContent =
      task.querySelector(".project").textContent;

    taskEditor.querySelector("#descriptionInput").value =
      task.querySelector(".description").textContent;

    const { isCompleted } = task.dataset;
    if (isCompleted === true) {
      markCompletedBtn.textContent = "Completed";
      markCompletedBtn.classList.add("mark");
    }
  }

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

  async function createTasks() {
    const listItems = await checkLocalStorage();
    if (listItems) {
      Object.values(listItems).forEach((item) => {
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container");
        taskContainer.innerHTML = `
          <div class="tag-container">
            <div class="priority">${item.priority}</div>
            <div class="due-date">${item.dueDate}</div>
            <div class="project">${item.project}</div>
          </div>
          <div class="info-container">
            <div class="title">${item.title}</div>
            <div class="description">${item.description}</div>
          </div>
        `;
        taskContainer.dataset.isCompleted = "false";
        taskContainer.addEventListener("click", () => {
          readTask(taskContainer);
        });
        listContainer.appendChild(taskContainer);
      });
    }
  }

  createTasks();
});
