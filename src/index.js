import './style.css';
import {format} from 'date-fns'
import {createElement, taskElements, Task} from  './elements.js';
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
    const select = document.querySelector('#filter-select');
    const records = storage.check;

    for (let item in records) {
        if (select.value === 'All') {
            taskCreator(records[item]);
        } else if (records[item].project === select.value) {
            taskCreator(records[item]);
        }
    }
    
    // Adjusting the width of the select tag for the filter
    select.setAttribute('style', `width: ${select.value.length * 7 + 15}px`);
    select.addEventListener('change', updateValue);

    function updateValue(e) {
        select.setAttribute('style', `width: ${e.target.value.length * 7 + 15}px`);
        return 0;
    }
};

const addTaskBtn = (() => {
    const btn = createElement('button', 'btn__addTask');
    btn.addEventListener('click', addTask);
    insertTask(btn);

    function addTask(e) {
        const removeItems = document.querySelectorAll('#container > div');
        const container = document.getElementById('container');
        removeItems.forEach((item) => {
            container.removeChild(item);
        });
    }
})();

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