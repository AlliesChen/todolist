import './style.css';
import {format} from 'date-fns'

const setHTML = (identifier) => {

    const select = document.querySelector(identifier.toString());

    function addClass(...classNames) {
        classNames.forEach(className => {
            select.classList.add(className);
        });
    }

    return {select, addClass}
};

function project(title, description, priority, dueDate, projectName) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.projectName = projectName;
};

setHTML('body').addClass('flex--col', 'aic', 'jc--btw');

setHTML('#container').addClass('container', 'flex--col', 'aic', 'jc--btw');

setHTML('header').addClass('header');

setHTML('footer').addClass('footer');

const Initializer = () => {
    const storageCheck = (localStorage.length) ? true : false;
    const defaultTodo = new project(
        "TODO 1: What you gonna make today :))",
        "Write it down, and maybe have some description to it. Also, you can add short notes, or checkbox to make things more clear 😁",
        "Medium",
        format(new Date(), 'MMM dd, yyyy'),
        "myProject",
    )
    
    if (!storageCheck) {
        console.table(defaultTodo);
    }
}

Initializer();