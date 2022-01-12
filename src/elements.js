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

const filterSelect = (() => {
    const select = document.querySelector('#filter-select');

    // Adjusting the width of the select tag for the filter
    select.setAttribute('style', `width: ${select.value.length * 7 + 15}px`);
    select.addEventListener('change', updateValue);
    
    function updateValue(e) {
        select.setAttribute('style', `width: ${e.target.value.length * 7 + 15}px`);
        return 0;
    }
    return {select};
})();

export {createElement, taskElements, Task, filterSelect};