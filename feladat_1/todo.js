import webStorage from './webStorage.js';

// "alap" feladat osztály
export default class Todo extends webStorage {
    constructor(el, initialData = []) {
        super('webprog1-ea-oojs',initialData); // Létrehozzuk a storage-ot

        this.todoEl = document.getElementById(el);
        this._tasks = [];

        this.init();
    }

    // Inicializálás, létrehozáskor elemek feltöltése és az első kirajzolás
    init() {
        this._tasks = this.getItems();
        this._tasks.forEach((task) => {
            this.todoEl.appendChild(this.createTaskNode(task));
        });

        // Az adatszerkezet pariban tartása
        this.on("updated", () => {
            this._tasks = this.getItems();
        });
    }

    // Task node létrehozása + eseményfigyelők létrehozása
    createTaskNode(task) {
        const node = document.createElement('div');
        node.classList.add('task');
        node.setAttribute('data-id', task.id);

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        if (task.completed) checkbox.setAttribute('checked', true);
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
        this.deleteItem(id);
        this.todoEl.removeChild(this.todoEl.querySelector(`.task[data-id="${id}"]`));
    }

    createTask(title) {
        const task = this.createItem({title, completed: false});
        this.todoEl.appendChild(this.createTaskNode(task));
    }

    completeTask(id) {
        this.saveItems(this.getItems().map((task) => {
            if (task.id === id) {
                task.completed = !task.completed;
            }
            return task;
        }));
    }
}