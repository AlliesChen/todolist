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

function Task(priority, dueDate, project, title, description) {
    this.priority = priority;
    this.dueDate = dueDate;
    this.project = project;
    this.title = title;
    this.description = description;
};

const Container = (() => {
    const add = (item) => {
        const container = document.getElementById('container');
        container.appendChild(item);
    };
    
    const clear = () => {
        const removeItems = document.querySelectorAll('#container > div');
        const container = document.getElementById('container');
        removeItems.forEach((item) => {
            container.removeChild(item);
        });
    };
    return {add, clear};
})();

export {createElement, Task, Container};