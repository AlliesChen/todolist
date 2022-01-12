import './style.css';
import {format} from 'date-fns'
import {createElement, taskElements, Task, filterSelect} from  './elements.js';
import {storage} from './storage.js';

const defaultTodo = new Task(
    "Medium",
    format(new Date(), 'MMM dd, yyyy'),
    "myProject",
    "What you gonna make today :))",
    "Write it down, and maybe have some description to it. Also, you can add short notes, or checkbox to make things more clear 😁",
);

const insertTask = (task) => {
    const container = document.getElementById('container');
    container.appendChild(task);
}

const taskCreator = (tasks) => {
    if ((typeof tasks) !== 'object') {
        return 0;
    }
    const container = taskElements.task;
    // Section for the tags
    const tagFrame = taskElements.tagFrame;
    const priority = taskElements.priority;
    const dueDate = taskElements.dueDate;
    const project = taskElements.project;
    // Section for the todos' info
    const infoFrame = taskElements.infoFrame;
    const title = taskElements.title;
    const description = taskElements.description;

    priority.textContent = tasks.priority;
    dueDate.textContent = tasks.dueDate;
    project.textContent = tasks.project;
    title.textContent = tasks.title;
    description.textContent = tasks.description;
    // The order of appending does matter
    tagFrame.appendChild(priority);
    tagFrame.appendChild(dueDate);
    tagFrame.appendChild(project);
    infoFrame.appendChild(title);
    infoFrame.appendChild(description);
    container.appendChild(tagFrame);
    container.appendChild(infoFrame);

    container.addEventListener('click', editTask);
    insertTask(container);

    function editTask(e) {
        console.log(e);
    }
}

const projectFilter = () => {
    const records = storage.check;
    const searchValue = filterSelect.select.value;
    for (let item in records) {
        if (searchValue === 'All') {
            taskCreator(records[item]);
        } else if (records[item].project === searchValue) {
            taskCreator(records[item]);
        }
    }
};

const addTaskBtn = (() => {
    const btn = createElement('button', 'btn__addTask');
    btn.addEventListener('click', addTask);
    insertTask(btn);

    function addTask(e) {
        btn.removeEventListener('click', addTask);
        btn.setAttribute('style', 'box-shadow: inset 0 0 10px -6px #000');
        const removeItems = document.querySelectorAll('#container > div');
        const container = document.getElementById('container');
        removeItems.forEach((item) => {
            container.removeChild(item);
        });
        taskEditor();
    }
})();

const taskEditor = (task) => {
    const taskBody = createElement('button', 'task__body');
    insertTask(taskBody);
}

const initialize = () => {
    if (!storage.check.__init__) {
        storage.check = {
            __default__: defaultTodo,
            __init__: true
        };
        initialize();
    } else {
        projectFilter();
    }
};

initialize();