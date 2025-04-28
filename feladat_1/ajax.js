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
            // Nem túl elegáns statisztika
            const sum = this._people.reduce((sum, person) => sum + Number(person.height), 0);
            document.getElementById('people-stat').innerHTML = `Magasság statisztika: összeg = ${sum} | átlag = ${sum / this._people.length} | legnagyobb = ${this._people.reduce((max, person) => person.height > max ? person.height : max, 0)}`; // Nem túl elegáns megoldás
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
        tdbtn.classList.add('buttons');

        // Törlés gomb
        const delbtn = document.createElement('button');
        delbtn.classList.add('item-delete');
        delbtn.setAttribute('title', 'Törlés');
        delbtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9.808 17h1V8h-1zm3.384 0h1V8h-1zM6 20V6H5V5h4v-.77h6V5h4v1h-1v14z"/></svg>'
        delbtn.addEventListener('click', () => this.deletePerson(person.id));
        tdbtn.appendChild(delbtn);

        // Szerkesztés gomb
        const editbtn = document.createElement('button');
        editbtn.classList.add('item-edit');
        delbtn.setAttribute('title', 'Szerkesztés');
        editbtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M4 13.885V8.769h7.5v5.116zm0-6.116V4h16v3.77zM4 20v-5.115h7.5V20zm8.5-6.116V8.77h7.304v1.039l-4.102 4.077zM13.23 21v-2.21l5.96-5.934l2.19 2.204L15.44 21zm5.96-4.985l.925-.956l-.924-.943l-.95.95z"/></svg>';
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
                this.showToast('success', 'Sikeres frissítés!');
                return true;
            }
            else {
                this.showToast('error', 'Sikertelen frissítés!');
                return false;
            }
        });
    }

    createPerson(person) {
        this.fetchApi('create', Object.fromEntries(person)).then(response => {
            if (response == 1) {
                this.reRenderTable();
                this.showToast('success', 'Sikeres létrehozás!');
                return true;
            }
            else {
                this.showToast('error', 'Sikertelen létrehozás!');
                return false;
            }
        });
    }

    deletePerson(id) {
        this.fetchApi('delete', { id }).then(response => {
            if (response == 1) {
                this.reRenderTable();
                this.showToast('success', 'Sikeres törlés!');
                return true;
            }
            else {
                this.showToast('error', 'Sikertelen törlés!');
                return false;
            }
        });
    }

    showToast(severity = 'success', msg = 'Siker!') {
        const toast = document.getElementById('toast');

        toast.innerHTML = msg;
        toast.classList.add(severity);
        toast.classList.add('show');

        setTimeout(() => { 
            toast.className = ''; 
            toast.innerHTML = '';
        }, 3000);
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