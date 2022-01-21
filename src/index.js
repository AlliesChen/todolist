import './style.css';
import { format } from 'date-fns';
import storage from './storage';
import { createElement, Task, Container } from './objAccessor';
import {
  TaskForm, ProjectFilter, AddTaskBtn, CancelBtn, setTaskContents, updateOption,
} from './components';

const defaultTodo = new Task(
  'Medium',
  format(new Date(), 'yyyy-MM-dd'),
  'myProject',
  'What you gonna do today :))',
  'Write it down, and maybe have some description to it. Also, you can add short notes, or checkbox to make things more clear 😁',
);

const setTaskForm = (task) => {
  const title = document.getElementById('todoInput');
  const dueDate = document.getElementById('todoDueDate');
  const priority = document.getElementById('todoPriority');
  const project = document.getElementById('todoProject');
  const descript = document.getElementById('todoDescription');
  title.setAttribute('type', 'text');
  title.value = task.title ?? '';
  dueDate.setAttribute('type', 'date');
  dueDate.value = task.dueDate ?? format(new Date(), 'yyyy-MM-dd');
  priority.value = task.priority ?? '';
  updateOption('todoProject');
  project.value = task.project ?? '';
  project.addEventListener('change', openPopUp);
  descript.value = task.description ?? '';
  function openPopUp(e) {
    if (e.target.value === 'Add New Project') {
      const input = prompt('Naming the Project');
      if (input !== null) {
        const newOpt = () => {
          const obj = createElement('option');
          obj.value = input;
          obj.textContent = input;
          return this;
        }
        e.target.appendChild(newOpt);
        e.target.value = input;
      } else {
        e.target.value = '';
        return 1;
      }
    }
    return this;
  }
};

AddTaskBtn.addEventListener('click', (e) => {
  Container.clear();
  Container.add(TaskForm);
  Container.add(CancelBtn);
  CancelBtn.setAttribute('style', 'display: block');
  e.target.setAttribute('style', 'display: none');
  setTaskForm('');
});

const pushTask = () => {
  const records = storage.check;
  const filterValue = records.__filter__;
  records.keys().forEach((item) => {
    const projectName = records[item].project;
    if ((filterValue === 'All' || filterValue === projectName) && (typeof records[item]) === 'object') {
      const taskContainer = setTaskContents(records[item]);
      Container.add(taskContainer);
      taskContainer.addEventListener('click', () => {
        Container.clear();
        Container.add(TaskForm);
        Container.add(CancelBtn);
        CancelBtn.setAttribute('style', 'display: block');
        AddTaskBtn.setAttribute('style', 'display: none');
        setTaskForm(records[item]);
      });
    }
  });
};

const initialize = () => {
  if (!storage.check.__init__) {
    storage.check = {
      __default__: defaultTodo,
      __filter__: 'All',
      __init__: true,
    };
    initialize();
  } else {
    Container.add(ProjectFilter);
    Container.add(AddTaskBtn);
    updateOption('filterSelect');
    pushTask();
  }
};

CancelBtn.onclick = (e) => {
  e.target.setAttribute('style', 'display: none');
  AddTaskBtn.setAttribute('style', 'display: block');
  Container.clear();
  initialize();
};

initialize();
