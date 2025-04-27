class People {
    constructor(el, base, secret) {

        this.peopleEl = document.getElementById(el);
        this._people = [];
        this.base =  base || '/ajax2/';
        this.secret =  secret || 'BE4RVPkd58w5dw';

        this.init();
    }

    // Inicializálás, létrehozáskor elemek feltöltése és az első kirajzolás
    init() {
        this._people = this.readPeople();
        /*this._tasks.forEach((task) => {
            this.todoEl.appendChild(this.createTaskNode(task));
        });

        // Az adatszerkezet pariban tartása
        this.on("updated", () => {
            this._tasks = this.getItems();
        });*/
    }

    fetchApi(endpoint, params = {}) {
        return fetch(this.base, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                ...{
                    op: endpoint || 'read',
                    code: this.secret
                },
                ...params 
            }),
            mode: 'cors'})
        .then(response => response.text())
        .then(data => {
            try {
                return JSON.parse(data);
            }
            catch (e) {
                return data;
            }
        })
        .catch((error) => {
            console.log(error);
            alert('Hiba az AJAX lekérdezéskor! Részletekért lásd a konzolt.');
        });
    }

    readPeople() {
        const people = this.fetchApi('read').then(people => {
            people.list.forEach(person => {
                console.log(person);
            });
        });
    }

    // Task node létrehozása + eseményfigyelők létrehozása
    /*createTaskNode(task) {
        const node = document.createElement('div');
        node.classList.add('task');
        node.setAttribute('data-id', task.id);

        // Checkbox
        const checkbox = document.createElement('input');rowCount
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
    }*/
}

const people = new People('people')