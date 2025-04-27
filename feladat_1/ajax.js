class People {
    constructor(el, base, secret) {

        this.peopleEl = document.getElementById(el);
        this._people = [];
        this.base =  base || '/ajax2/';
        this.secret =  secret || 'BE4RVPkd58w5dw';

        this.reRenderTable();
    }

    async fetchApi(endpoint, params = {}) {
        return await fetch(this.base, {
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
        if (this._people.length) {
            this._people.forEach((person) => {
                this.peopleEl.appendChild(this.createPersonNode(person));
            });
        }
        else {
            this.peopleEl.innerHTML = '<tr><td colspan="5"><em>Nincs kirenderelhető adat!</em></td></tr>'
        }
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
        editbtn.addEventListener('click', () => this.editPerson(person.id));
        tdbtn.appendChild(editbtn);

        node.appendChild(tdbtn);

        return node;
    }

    reRenderTable() {
        //console.log(this.readPeople())
        this.readPeople().then((people) => {
            this._people = people;
            this.renderTable();
        });
    }

    readPeople() {
        return this.fetchApi('read').then(people => {
            return people.list;
        });
    }

    getPerson(id) {
        return this._people.find((person) => person.id == id);
    }

    editPerson(id) {
        openModal(id);
    }
    
    updatePerson(person) {
        this.fetchApi('update', Object.fromEntries(person)).then(response => {
            if (response == 1) {
                this.reRenderTable();
                return true;
            }
            else {
                return false;
            }
        });
    }

    createPerson(person) {
        this.fetchApi('create', Object.fromEntries(person)).then(response => {
            if (response == 1) {
                this.reRenderTable();
                return true;
            }
            else {
                return false;
            }
        });
    }

    deletePerson(id) {
        this.fetchApi('delete', { id }).then(response => {
            if (response == 1) {
                this.reRenderTable();
                return true;
            }
            else {
                return false;
            }
        });
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
        people.updatePerson(formData);
    }
    else {
        people.createPerson(formData);
    }
    closeModal();
}