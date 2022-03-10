const Storage = (() => {
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
  const todolist = {
    tasks: {
      init: initTask,
    },
    projects: {
      myProject: 0,
    },
    preference: {
      projectFilter: "",
      displayFilter: "All",
    },
  };

  async function getTodolist() {
    try {
      const list = await JSON.parse(localStorage.getItem("todolist"));
      if (!(await list)) {
        localStorage.setItem("todolist", JSON.stringify(todolist));
        getTodolist();
      }
      return list;
    } catch (err) {
      throw new Error("todolist isn't exit");
    }
  }
  return { getTodolist };
})();

export default Storage;

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

const dateMaker = (date) => {
  const formattedDate = new Date(date);
  const [month, day, year] = [
    formattedDate.getMonth(),
    formattedDate.getDate(),
    formattedDate.getFullYear(),
  ];
  const inputTypeDate = `${year}-${
    month + 1 < 10 ? "0".concat(month + 1) : month
  }-${day < 10 ? "0".concat(day) : day}`;
  return inputTypeDate;
};

export { hash, dateMaker };
