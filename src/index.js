import './style.css';
import {format} from 'date-fns'
import {storage} from './storage.js';
import {createElement, Task, Container} from  './elements.js';
import {taskSets, ProjectFilter, AddTaskBtn, CancelBtn, setTaskContents} from './page_components';

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

const updateFilterOption = () => {
    const select = document.getElementById('filterSelect');
    const records = storage.check;

    for (let item in records) {
        const projectName = records[item].project;

        if (!projectName) continue;

        const option = createElement('option');

        option.value = option.textContent = projectName;
        select.appendChild(option);
    }

    select.value = records.__filter__;
    select.setAttribute('style', `width: ${select.value.length * 7 + 15}px`);
    select.addEventListener('change', () => {
        storage.check = {
            __filter__: select.value,
        };
        updateFilterOption();
    });
}

const pushTask = () => {
    const records = storage.check;
    const filterValue = records.__filter__;
    
    for (let item in records) {
        const projectName = records[item].project;

        if ((filterValue === 'All' || filterValue === projectName) && (typeof records[item]) === 'object') {
            const taskContainer = setTaskContents(records[item]);
            Container.add(taskContainer);
            taskContainer.addEventListener('click', () => {
                Container.clear();
                taskEditor(records[item]);
            });
        }
    }
};

const initialize = () => {
    if (!storage.check.__init__) {
        storage.check = {
            __default__: defaultTodo,
            __filter__: 'All',
            __init__: true
        };
        initialize();
    } else {
        Container.add(ProjectFilter);
        Container.add(AddTaskBtn);
        updateFilterOption();
        pushTask();
    }
};

initialize();