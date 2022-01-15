import {createElement, Container} from  './elements.js';

// Using in the homepage
const taskElements = {
    get task() { 
        return createElement('div', 'task', 'cursor--p');
    },
    get tagFrame(){
        return createElement('section', 'tagFrame');
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

// Using in the editor page
const taskSets = {
    get body() {
        return createElement('section', 'flex', 'fgap--10');            
    },
    get label() {
        return createElement('label', 'fs--22', 'm--0');
    },
    get input() {
        return createElement('input');
    },
    get select() {
        return createElement('select');
    },
};

const AddTaskBtn = (() => {
    const btn = createElement('button', 'btn__addTask', 'cursor--p');
    Container.add(btn);

    return btn;
})();

const CancelBtn = (() => {
    const btn = createElement('button', 'btn__cancel', 'cursor--p');
    btn.setAttribute('style', 'display: block');
    return btn;
})();

const setTaskContents = (task) => {
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

    Container.add(container);
    
    return container;
};

export {taskSets, CancelBtn, AddTaskBtn, setTaskContents};