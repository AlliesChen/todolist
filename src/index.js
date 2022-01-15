import './style.css';
import {format} from 'date-fns'
import {storage} from './storage.js';
import {createElement, Task, Container} from  './elements.js';
import {taskSets, CancelBtn, AddTaskBtn, setTaskContents} from './page_components';

const defaultTodo = new Task(
    "Medium",
    format(new Date(), 'yyyy-MM-dd'),
    "myProject",
    "What you gonna do today :))",
    "Write it down, and maybe have some description to it. Also, you can add short notes, or checkbox to make things more clear 😁",
);

AddTaskBtn.addEventListener('click', (e) => {
    Container.clear();
    taskEditor('');
});

CancelBtn.onclick = (e) => {
    e.target.setAttribute('style', 'display: none');
    AddTaskBtn.setAttribute('style', 'display: block');
    Container.clear();
    initialize();
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
    Container.add(taskBody);
    Container.add(CancelBtn);
    CancelBtn.setAttribute('style', 'display: block');
    AddTaskBtn.setAttribute('style', 'display: none');

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
        if ((filterValue === 'All' || filterValue === records[item].projec) && (typeof records[item]) === 'object') {
            const taskContainer = setTaskContents(records[item]);
            taskContainer.addEventListener('click', () => {
                Container.clear();
                taskEditor(records[item]);
            });
        }
    }

    label.id = 'filterLabel'
    label.textContent = 'Project: ';
    label.for = select.id = 'filterSelect';
    select.name = 'projects'
    select.value = filterValue;

    filter.appendChild(label);
    filter.appendChild(select);
    Container.add(filter);
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