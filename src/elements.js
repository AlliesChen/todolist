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

// Using in the homepage
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
}

function Task(priority, dueDate, project, title, description) {
    this.priority = priority;
    this.dueDate = dueDate;
    this.project = project;
    this.title = title;
    this.description = description;
};

const addToContainer = (item) => {
    const container = document.getElementById('container');
    container.appendChild(item);
}

export {createElement, taskElements, taskSets, Task, addToContainer};