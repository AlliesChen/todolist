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

export {taskElements, Task};