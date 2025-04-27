class People {
    constructor(el, base, secret) {

        this.peopleEl = document.getElementById(el);
        this._people = [];
        this.base =  base || '/ajax2/';
        this.secret =  secret || 'BE4RVPkd58w5dw';

        this.readPeople();
    }

    // Inicializálás, létrehozáskor elemek feltöltése és az első kirajzolás
    init() {
        this._people = this.readPeople();
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

    renderTable() {
        this.peopleEl.innerHTML = '';
        this._people.forEach((person) => {
            this.peopleEl.appendChild(this.createPersonNode(person));
        });
    }

    // Node létrehozása + eseményfigyelők létrehozása
    createPersonNode(person) {
        const node = document.createElement('tr');
        node.setAttribute('data-id', person.id);

        // Táblázat oszlopai
        Object.entries(person).forEach(([key, value]) => {
            if (['id', 'name', 'height', 'weight'].includes(key)) {
                const td = document.createElement('td');
                td.innerText = value;
                node.appendChild(td);
            }
        });

        // Gombok cellája
        const tdbtn = document.createElement('td');

        // Törlés gomb
        const delbtn = document.createElement('button');
        delbtn.classList.add('delete');
        delbtn.innerText = 'Törlés';
        delbtn.addEventListener('click', () => this.deletePerson(person.id));
        tdbtn.appendChild(delbtn);

        // Szerkesztés gomb
        const editbtn = document.createElement('button');
        editbtn.classList.add('edit');
        editbtn.innerText = 'Szerkesztés';
        editbtn.addEventListener('click', () => this.deletePerson(person.id));
        tdbtn.appendChild(editbtn);

        node.appendChild(tdbtn);

        return node;
    }

    readPeople() {
        this.fetchApi('read').then(people => {
            this._people = people.list;
            this.renderTable();
        });
    }

    createPerson(person) {
        this.fetchApi('create', Object.fromEntries(person)).then(response => {
            if (response == 1) {
                this.readPeople();
                return true;
            }
            else {
                return false;
            }
        });
    }

    deleteTask(id) {
        this.deleteItem(id);
        this.todoEl.removeChild(this.todoEl.querySelector(`.task[data-id="${id}"]`));
    }

    createTask(title) {
        const task = this.createItem({title, completed: false});
        this.todoEl.appendChild(this.createTaskNode(task));
    }
}

// Emberek létrehozása
const people = new People('people')

// Felugró ablak kezelése

const form = document.getElementById('person-edit');
const modal = document.getElementById('person-modal');

function openModal(id = null) {
    // Űrlap kitöltése ha van id
    if(id) {
        const item = people.getPerson(id);
        Object.entries(item).forEach(([key, value]) => form.elements.namedItem(key) && (form.elements.namedItem(key).value = value));
    }
    modal.classList.remove('hidden');
}

function closeModal() {
    // TODO: Űrlap ürítése
    form.reset();
    modal.classList.add('hidden');
}

// Bezárás figyelése
modal.addEventListener('click', () => closeModal());
modal.querySelector('.box').addEventListener('click', (e) => e.stopPropagation()); // Hogy ne záródjon be ha kattingatunk a felugró ablakban
document.getElementById('close-modal').addEventListener('click', () => closeModal());

// Új elem gomb figyelése
document.getElementById('new-item').addEventListener('click', () => openModal());

// Űrlap kezelése
form.onsubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    console.log(formData);

    // Ha van ID frisstünk, ha nincs újat hozunk létre
    if(formData.get('id')) {
        people.updatePerson(formData.get('id'), formData);
    }
    else {
        people.createPerson(formData);
    }
    closeModal();
}