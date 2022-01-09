import './style.css';
import {format} from 'date-fns'

const createElement = (element, ...classNames) => {
    const obj = document.createElement(element);
    const newObj = Object.assign(obj, {addClass});
    
    if (classNames.length > 0) {
        newObj.addClass(classNames);
    }
    
    function addClass(...attrs) {
        attrs.forEach(attr => {
            this.classList.add(attr);
        });
    };

    return newObj
};

const webElements = {
    get task() { 
        return createElement('div', 'task');
    },
    get title() {
        return createElement('p', 'title');
    },
    get description() {
        return createElement('p', 'content');
    },
    get priority() {
        return createElement('div', 'tags');
    },
    get dueDate() {
        return createElement('div', 'tags');
    },
    get projectName() {
        return createElement('div', 'tags');
    },
};

function project(title, description, priority, dueDate, projectName) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.projectName = projectName;
};

const defaultTodo = new project(
    "TODO 1: What you gonna make today :))",
    "Write it down, and maybe have some description to it. Also, you can add short notes, or checkbox to make things more clear 😁",
    "Medium",
    format(new Date(), 'MMM dd, yyyy'),
    "myProject",
);

const storage = {
    usage: (localStorage.length) ? JSON.parse(localStorage.getItem('TODOList')) : {},
    get check() {
        return this.usage;
    },
    set check(item) {
        const local = Object.assign(this.usage, item);
        localStorage.setItem('TODOList', JSON.stringify(local));
    }
};

const initializer = () => {
    if (!storage.check.__init__) {
        storage.check = {
            __default__: defaultTodo,
            __init__: true
        };
        initializer();
    } else {
        DataReader();
    }
};

const Filter = (() => {
    const select = document.querySelector('#filter-select');
    storage.check = {__filter__: select.value};
    
    select.setAttribute('style', `width: ${select.value.length * 7 + 15}px`);
    select.addEventListener('input', updateValue);

    function updateValue(e) {
        select.setAttribute('style', `width: ${e.target.value.length * 7 + 15}px`);
        return 0;
    }
})();

const DataReader = () => {
    const bundle = storage.check;
    const container = document.getElementById('container');
    const footer = document.querySelector('footer');
    const filter = bundle["__filter__"];

    for (let key in bundle) {        
        if (key === "__filter__") continue;
        if ((bundle[key].projectName !== filter) && (filter !== "All")) continue;
        if(typeof bundle[key] !== "object") continue;
        
        const frame = webElements.task;
        const title = webElements.title;
        const description = webElements.description;
        const priority = webElements.priority;
        const dueDate = webElements.dueDate;
        const projectName = webElements.projectName;

        title.textContent = bundle[key].title;
        description.textContent = bundle[key].description;
        priority.textContent = bundle[key].priority;
        dueDate.textContent = bundle[key].dueDate;
        projectName.textContent = bundle[key].projectName;

        frame.appendChild(priority);
        frame.appendChild(dueDate);
        frame.appendChild(projectName);
        frame.appendChild(title);
        frame.appendChild(description);

        container.insertBefore(frame, footer);
    };
}

initializer();