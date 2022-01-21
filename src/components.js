import { createElement } from './objAccessor';
import { storage } from './storage';

// Using in the homepage
const taskElements = {
  get task() {
    return createElement('div', 'task', 'cursor--p');
  },
  get tagFrame() {
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
const createTaskSets = (element, title, forId) => {
  const container = createElement('section', 'flex', 'fgap--10');
  const label = createElement('label', 'fs--22', 'm--0');
  const input = createElement(element);
  label.textContent = title;
  label.setAttribute('for', forId);
  input.id = forId;
  container.appendChild(label);
  container.appendChild(input);
  return container;
};

// Using in the editor page
const TaskForm = (() => {
  const container = createElement('div', 'task__body', 'flex--col', 'fgap--10');
  // Give the section title and id to the label and its input(select)
  const titleSec = createTaskSets('input', 'TODO:', 'todoInput');
  const dateSec = createTaskSets('input', 'Due Date:', 'todoDueDate');
  const prioritySelect = createTaskSets('select', 'Priority:', 'todoPriority');
  const projectSelect = createTaskSets('select', 'Project:', 'todoProject');
  const descriptSec = createTaskSets('input', 'Description:', 'todoDescription');
  container.appendChild(titleSec);
  container.appendChild(dateSec);
  container.appendChild(prioritySelect);
  container.appendChild(projectSelect);
  container.appendChild(descriptSec);

  return container;
})();

const deleteOptions = (id) => {
  const select = document.getElementById(id);
  while (select.childNodes.length) {
    const child = select.childNodes[0];
    select.removeChild(child);
  }
};

const updateOption = (id) => {
  const select = document.getElementById(id);
  const records = storage.check;
  const temp = select.value;
  deleteOptions(select);
  const option = createElement('option');
  option.value = option.textContent = "All";
  select.appendChild(option);
  records.keys().forEach((item) => {
    const projectName = records[item].project;
    if (projectName) {
      const option = createElement('option');
      option.value = option.textContent = projectName;
      select.appendChild(option);
      select.value = temp;
    }
  });
};

const setSelectAttr = (id) => {
  const select = document.getElementById(id);
  select.setAttribute('style', `width: ${select.value.length * 7 + 15}px`);
};

const ProjectFilter = (() => {
  const container = createElement('section', 'filter');
  const label = createElement('label', 'm--0');
  const select = createElement('select');
  label.id = 'filterLabel';
  label.textContent = 'Project: ';
  label.for = select.id = 'filterSelect';
  select.name = 'projects';
  select.addEventListener('change', () => {
    storage.check = {
      __filter__: select.value,
    };
    updateOption('filterSelect');
  });
  container.appendChild(label);
  container.appendChild(select);
  return container;
})();

const AddTaskBtn = (() => {
  const btn = createElement('button', 'btn__addTask', 'cursor--p');
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
  return container;
};

export {
  TaskForm, ProjectFilter, CancelBtn, AddTaskBtn, setTaskContents, updateOption,
};
