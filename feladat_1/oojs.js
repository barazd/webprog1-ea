
import Todo from './todo.js';

const todo = new Todo('todo');

const createTaskForm = document.getElementById('create-task');

createTaskForm.onsubmit = (e) => {
    e.preventDefault();
    todo.createTask(e.target.elements.namedItem('title').value);
    e.target.reset();
}