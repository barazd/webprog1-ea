
import Todo from './todo.js';

// Kezdő adatok
const initialData = [
    { id: crypto.randomUUID(), title: 'Meglátogatni a Tattoria la prima-t', completed: false },
    { id: crypto.randomUUID(), title: 'Enni a Nyolckincs Étteremben', completed: false },
    { id: crypto.randomUUID(), title: 'Kipróbálni a Sugo de Italia-t', completed: false },
    { id: crypto.randomUUID(), title: 'Ebédelni az Öregponty Csárdában', completed: false },
    { id: crypto.randomUUID(), title: 'Kajálni egyet a Pasha Dürüm-ben', completed: false },
    { id: crypto.randomUUID(), title: 'Inni egy lassit a Jal Mahal Falatozóban', completed: false },
];

const todo = new Todo('todo', initialData);

const createTaskForm = document.getElementById('create-task');

createTaskForm.onsubmit = (e) => {
    e.preventDefault();
    todo.createTask(e.target.elements.namedItem('title').value);
    e.target.reset();
}