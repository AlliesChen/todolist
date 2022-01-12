import './style.css';
import {format} from 'date-fns'

const createElement = (element, ...classNames) => {
    const obj = document.createElement(element);
    const newObj = Object.assign(obj, {addClass});
    
    if (classNames.length > 0) {
        newObj.addClass(classNames);
    }
    
    function addClass(attrs) {
        if (attrs.length) {
            this.classList.add(attrs.pop());
            this.addClass(attrs);
        }
    };

    return newObj
};

const taskElements = {
    get task() { 
        return createElement('div', 'task');
    },
    get tagFrame(){
        return createElement('section', 'tagFrame')
    },
    get priority() {
        return createElement('p', 'tags');
    },
    get dueDate() {
        return createElement('p', 'tags');
    },
    get project() {
        return createElement('p', 'tags');
    },
    get infoFrame() {
        return createElement('section', 'infoFrame');
    },
    get title() {
        return createElement('p', 'fs--22', 'm--0');
    },
    get description() {
        return createElement('p', 'fs--18', 'm--0');
    },
};

function Task(priority, dueDate, project, title, description) {
    this.priority = priority;
    this.dueDate = dueDate;
    this.project = project;
    this.title = title;
    this.description = description;
};

const defaultTodo = new Task(
    "Medium",
    format(new Date(), 'MMM dd, yyyy'),
    "myProject",
    "What you gonna make today :))",
    "Write it down, and maybe have some description to it. Also, you can add short notes, or checkbox to make things more clear 😁",
);

const storage = {
    usage: (localStorage.length) ? JSON.parse(localStorage.getItem('TODOList')) : {},
    get check() {
        return this.usage;
    },
    set check(item) {
        const local = Object.assign(this.usage, item);
        localStorage.setItem('TODOList', JSON.stringify(local));
    },
};

const insertTask = (task) => {
    const container = document.getElementById('container');
    const footer = document.getElementById('footer');
    container.insertBefore(task, footer);
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