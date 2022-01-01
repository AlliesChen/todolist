import './style.css';

const DOMController = (identifier) => {

    const select = document.querySelector(identifier.toString());

    return {select}
};

function project(title, description, priority, dueDate) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
};

DOMController('body').select.classList.add('flex--col', 'aic', 'jc--btw');

DOMController('.container').select.classList.add('flex--col', 'aic', 'jc--btw');

DOMController('header').select.classList.add('header');

DOMController('footer').select.classList.add('footer');