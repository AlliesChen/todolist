import { filterContainer, listContainer } from "./UI";
import Storage from "./Storage";

const Filter = (() => {
  function filterProject(event) {
    const inputValue = event.target.value.toUpperCase();
    const keywords = inputValue.split("");
    listContainer.querySelectorAll(".task-container").forEach((task) => {
      task.classList.remove("dp-none");
      const projectName = task.querySelector(
        ".tag-container > .project"
      ).textContent;
      const comparison = projectName.toUpperCase().split("");
      if (!inputValue) return 1;
      for (let i = 0; i < keywords.length; i += 1) {
        if (comparison[i] !== keywords[i]) {
          task.classList.add("dp-none");
          return 1;
        }
      }
      return 0;
    });
  }

  async function getFilterSetting() {
    const todolist = await Storage.getTodolist();
    const filterSetting = await todolist.preference.displayFilter;
    filterContainer.querySelector("#displayFilter > button").textContent =
      filterSetting;
    return filterSetting;
  }

  async function setFilter() {
    const todolist = await Storage.getTodolist();
    const newList = await todolist;
    newList.preference.displayFilter = filterContainer.querySelector(
      "#displayFilter > button"
    ).textContent;
    localStorage.clear();
    localStorage.setItem("todolist", JSON.stringify(newList));
  }

  async function filterTasks() {
    try {
      const filterValue = await getFilterSetting();
      const taskContainers = listContainer.querySelectorAll(".task-container");
      taskContainers.forEach((task) => {
        task.classList.remove("dp-none");
        const taskStatus =
          task.getAttribute("data-status") === "true"
            ? "Completed"
            : "Uncompleted";
        if (taskStatus !== filterValue && filterValue !== "All") {
          task.classList.add("dp-none");
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async function bubbleSort(arr) {
    const sortedArr = arr;
    for (let i = 0; i < sortedArr.length - 1; i += 1) {
      for (let j = 0; j < sortedArr.length - 1 - i; j += 1) {
        // [id, date, priority, name]
        // earlier date frist
        const date1 = Number.parseInt(sortedArr[j][1], 16);
        const date2 = Number.parseInt(sortedArr[j + 1][1], 16);
        const laterDate = date1 > date2;
        const sameDate = date1 === date2;
        // then which has higher priority
        const higherPriority = sortedArr[j][2] < sortedArr[j + 1][2];
        const samePriority = sortedArr[j][2] === sortedArr[j + 1][2];
        // otherwise, by the order of A-Z
        let priorNameIndex = false;
        const nameArr1 = sortedArr[j][3];
        const nameArr2 = sortedArr[j + 1][3];
        const letterLength =
          nameArr1.length < nameArr2.length ? nameArr1.length : nameArr2.length;
        const sameString = nameArr1.join() === nameArr2.join();
        for (let k = 0; k < letterLength; k += 1) {
          if (nameArr1[k] < nameArr2[k]) {
            priorNameIndex = true;
          }
        }
        // finally, base on whether tasks are completed
        const uncompleted = sortedArr[j][4] < sortedArr[j + 1][4];
        const sameStatus = sortedArr[j][4] === sortedArr[j + 1][4];
        // comparison
        let shouldSwap = false;
        if (!sameDate) {
          shouldSwap = laterDate;
        } else if (!samePriority) {
          shouldSwap = higherPriority;
        } else if (!sameString) {
          shouldSwap = priorNameIndex;
        } else if (!sameStatus) {
          shouldSwap = uncompleted;
        }
        if (shouldSwap) {
          const temp = sortedArr[j];
          sortedArr[j] = sortedArr[j + 1];
          sortedArr[j + 1] = temp;
        }
      }
    }
    return sortedArr;
  }

  async function sortTasks() {
    const taskContainers = listContainer.querySelectorAll(".task-container");
    const taskArr = [];
    Array.from(taskContainers).forEach((task) => {
      const id = task.getAttribute("data-name");
      // p1 factor in comparison
      const dueDate = task.querySelector(".due-date").textContent;
      const date = new Date(dueDate);
      const msc = date.getTime();
      // p2 factor in comparison
      const priority = task.querySelector(".priority").textContent;
      const priorityScore = {
        none: 0,
        Low: 1,
        Medium: 2,
        High: 3,
      };
      // p3 factor in comparison
      const project = task.querySelector(".project").textContent;
      // sorted in order from A-Z
      const projectCodeArr =
        project !== "none"
          ? project
              .toUpperCase()
              .split("")
              .map((x) => x.charCodeAt() * -1)
          : [-91];
      // p4 factor in comparison
      const status = task.getAttribute("data-status");
      const statusScore = status === "true" ? -1 : 1;
      // Using in comparison
      const el = [
        id,
        msc,
        priorityScore[priority],
        projectCodeArr,
        statusScore,
      ];
      taskArr.push(el);
    });
    const sortedArr = await bubbleSort(taskArr);
    sortedArr.forEach((item) => {
      const [id] = item;
      const taskNode = listContainer.querySelector(`[data-name="${id}"]`);
      const copy = taskNode;
      listContainer.removeChild(taskNode);
      listContainer.appendChild(copy);
      return 0;
    });
  }

  filterContainer
    .querySelector("#projectFilterInput")
    .addEventListener("input", (e) => filterProject(e));

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
      Promise.resolve(setFilter()).then(() => {
        filterTasks();
      });
    }
    filterContainer.querySelector(".dropdown").classList.remove("active");
  });
  return { filterTasks, sortTasks };
})();

export default Filter;
