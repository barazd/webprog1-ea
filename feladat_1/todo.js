import webStorage from './webStorage.js';

// "alap" feladat osztály
export default class Todo extends webStorage {
    constructor(el) {
        super('webprog1-ea-oojs', [{id: 1, title: 'Feladat 1', completed: false}, {id: 2, title: 'Feladat 2', completed: false}]); // Létrehozzuk a storage-ot

        this.todoEl = document.getElementById(el);
        this._todo = [];

        this.init();
    }

    init() {
        this._todo = this.getItems();
        this._todo.forEach((task) => {
            this.todoEl.appendChild(this.createTaskNode(task));
        });
    }

    createTaskNode(task) {
        const node = document.createElement('li');
        node.setAttribute('data-id', task.id);

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('checked', task.checked);
        checkbox.addEventListener('change', () => this.completeTask(task.id));
        node.appendChild(checkbox);

        // Szöveg
        const title = document.createElement('span');
        title.innerText = task.title;
        node.appendChild(title);

        // Törlés gomb
        const btn = document.createElement('button');
        btn.classList.add('delete-task');
        btn.innerText = 'Törlés';
        btn.addEventListener('click', () => this.deleteTask(task.id));
        node.appendChild(btn);

        return node;
    }

    deleteTask(id) {
        console.log('del task' + id)
        
    }

    createTask(title) {
        console.log('create task' + title)

    }

    completeTask(id) {
        console.log('complete task' + id)
    }

    renderHtml() {
        return this._todo.reduce((html, task) => html + `<li><input type="checkbox" checked="${task.completed}" data-id="${task.id} /> ${task.title} <button data-id="${task.id}">törlés</button></li>`, '');
    }
}