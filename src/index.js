import './style.css';
import {format} from 'date-fns'
import {createElement, taskElements, taskSets, Task, addToContainer} from  './elements.js';
import {storage} from './storage.js';

const defaultTodo = new Task(
    "Medium",
    format(new Date(), 'yyyy-MM-dd'),
    "myProject",
    "What you gonna make today :))",
    "Write it down, and maybe have some description to it. Also, you can add short notes, or checkbox to make things more clear 😁",
);

const taskCreator = (task) => {
    if ((typeof task) !== 'object') {
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

    priority.textContent = task.priority;
    dueDate.textContent = task.dueDate;
    project.textContent = task.project;
    title.textContent = task.title;
    description.textContent = task.description;
    // The order of appending does matter
    tagFrame.appendChild(priority);
    tagFrame.appendChild(dueDate);
    tagFrame.appendChild(project);
    infoFrame.appendChild(title);
    infoFrame.appendChild(description);
    container.appendChild(tagFrame);
    container.appendChild(infoFrame);

    container.addEventListener('click', () => {
        taskEditor(task);
    });
    addToContainer(container);
}

const projectFilter = () => {
    const filter = createElement('div', 'filter');
    const label = createElement('label', 'm--0');
    const select = createElement('select');    
    const option = createElement('option');
    const filterValue = (() => {
        if(!storage.check.__filter__) {
            storage.check = {
                __filter__: 'All',
            };
        }
        return storage.check.__filter__;
    })();
    const records = storage.check;

    option.value = option.textContent = 'All';
    select.appendChild(option);

    for (let item in records) {
        if (records[item].project) {
            const option = createElement('option');
            option.value = option.textContent = records[item].project;
            select.appendChild(option);
        }
        if (filterValue === 'All' || filterValue === records[item].project) {
            taskCreator(records[item]);
        }
    }

    label.id = 'filterLabel'
    label.textContent = 'Project: ';
    label.for = select.id = 'filterSelect';
    select.name = 'projects'
    select.value = filterValue;
    
    filter.appendChild(label);
    filter.appendChild(select);
    addToContainer(filter);
    setFilterAttr();

    // Adjusting the width of the select tag for the filter
    function setFilterAttr() {
        select.setAttribute('style', `width: ${select.value.length * 7 + 15}px`);
        storage.check = {
            __filter__: select.value,
        }
        select.addEventListener('change', setFilterAttr);
    
        return 0;
    };
};

const taskEditor = (task) => {
    const taskBody = createElement('div', 'task__body');
    const todoInput = getInput('TODO:', 'todoInput');
    const dueDateInput = getInput('Due Date:', 'todoDueDate');
    const prioritySelect = getSelect('Priority:', 'todoPriority', '', 'Low', 'Medium', 'High');
    const projectSelect = getSelect('Project:', 'todoProject', '', 'Add New Project');
    const descriptionInput = getInput('Description:', 'todoDescription');

    projectSelect.addEventListener('change', openPopUp);

    todoInput.setAttribute('type', 'text');
    dueDateInput.setAttribute('type', 'date');

    todoInput.value = task.title ?? '';
    dueDateInput.value = task.dueDate ?? format(new Date(), 'yyyy-MM-dd');
    prioritySelect.value = task.priority ?? '';
    projectSelect.value = task.project ?? '';
    descriptionInput.value = task.description ?? '';
    addToContainer(taskBody);

    const submitBtn = createElement('button');
    submitBtn.setAttribute('style', 'width: 100vw; height: 100vh;background-color: rgb(255, 255, 255, 0.1); position: fixed; top: 0; left: 0; border: none');
    submitBtn.onclick = initialize();
    addToContainer(submitBtn);

    function openPopUp(e) {
        if (e.target.value === 'Add New Project');
        let input = prompt('Naming the Project');
        if (input !== null) {
            const newOption = createElement('option');
            newOption.value, newOption.textContent = input;
            e.target.appendChild(newOption);
            e.target.value = input;  
        } else {
            e.target.value = '';
            return 1;
        }
        return 0;
    }

    function getInput(title, forId) {
        const container = taskSets.body;
        const todoTitle = taskSets.label;
        const todoInput = taskSets.input;

        todoTitle.textContent = title;
        todoTitle.setAttribute('for', forId);

        todoInput.id = forId;

        container.appendChild(todoTitle);
        container.appendChild(todoInput);
        taskBody.appendChild(container);

        return todoInput;
    }

    function getSelect(title, forId, ...optionArr) {
        const container = taskSets.body;
        const todoTitle = taskSets.label;
        const todoSelect = taskSets.select;

        todoTitle.textContent = title;
        todoTitle.setAttribute('for', forId);

        todoSelect.id = forId;

        optionArr.forEach((option) => {
            const selectOption = createElement('option');
            selectOption.value = option;
            selectOption.textContent = option;
            todoSelect.appendChild(selectOption);
        });

        container.appendChild(todoTitle);
        container.appendChild(todoSelect);
        taskBody.appendChild(container);

        return todoSelect;
    }
}

const addTaskBtn = (() => {
    const btn = createElement('button', 'btn__addTask');
    btn.addEventListener('click', clearContainer);
    addToContainer(btn);

    function clearContainer(e) {
        e.target.setAttribute('style', 'box-shadow: inset 0 0 10px -6px #000');
        const removeItems = document.querySelectorAll('#container > div');
        const container = document.getElementById('container');
        removeItems.forEach((item) => {
            container.removeChild(item);
        });
        taskEditor('');
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