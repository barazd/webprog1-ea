import webStorage from './webStorage.js';

// Étterem típusok
const restaurantTypes = [
    { id: 1, title: 'Pizza' },
    { id: 2, title: 'Kínai' },
    { id: 3, title: 'Olasz' },
    { id: 4, title: 'Magyaros' },
    { id: 5, title: 'Gyros' },
    { id: 6, title: 'Indiai' },
    { id: 7, title: 'Vietnámi' },
    { id: 8, title: 'Hamburger' },
    { id: 9, title: 'Vegán' },
    { id: 10, title: 'Cukrászda' },
];

// Kezdő adatok
const initialData = [
    { id: crypto.randomUUID(), name: 'Tattoria la prima', city: 'Eger', type: 1, rating: 8 },
    { id: crypto.randomUUID(), name: 'Nyolckincs Étterem', city: 'Budapest IX.', type: 2, rating: 6 },
    { id: crypto.randomUUID(), name: 'Sugo de Italia', city: 'Kecskemét', type: 3, rating: 10 },
    { id: crypto.randomUUID(), name: 'Öregponty Csárda', city: 'Szeged', type: 4, rating: 4 },
    { id: crypto.randomUUID(), name: 'Pasha Dürüm', city: 'Győr', type: 5, rating: 7 },
    { id: crypto.randomUUID(), name: 'Jal Mahal Falatozó', city: 'Budapest III.', type: 6, rating: 8 },
];

// Táblázat struktúrája
const tableStructure = [
    { title: 'ID', key: 'id', sortable: true, format: (data) => `<code>${data.split('-')[0]}</code>` },
    { title: 'Étterem neve', key: 'name', sortable: true, format: (data) => `<strong>${data}</strong>` },
    { title: 'Település', order: 'desc', key: 'city', sortable: true },
    { title: 'Típus', key: 'type', format: (data) => restaurantTypes.find((item) => item.id == data).title },
    { title: 'Értékelés', key: 'rating', sortable: true, format: (data) => `${data}/10` },
];

// Táblázat kirajzolása
function renderTable(data, structure) {
    const table = document.querySelector('#restaurants');
    // Fejléc renderelése
    table.querySelector('thead').innerHTML = '<tr>' + 
        structure.reduce((row, kind) => row + 
            `<th class="${kind.sortable ? 'sortable' : ''} ${kind.order || ''}" data-key="${kind.key}">${kind.title}</th>`, '') + 
            '<th></th>' + 
        '</tr>';

    // Tartalom sorbarendezése
    const orderBy = structure.find((item) => item.order);
    data = data.sort((a, b) => { 
        // Ha számok
        if (!isNaN(a[orderBy.key]) && !isNaN(b[orderBy.key])) {
            return (orderBy.order === 'asc') ?
                a[orderBy.key] - b[orderBy.key] : 
                b[orderBy.key] - a[orderBy.key];
        }  else {
            // Ha más, akkor szövegként kezeljük
            return (orderBy.order === 'asc') ?
                a[orderBy.key].toString().localeCompare(b[orderBy.key]) : 
                b[orderBy.key].toString().localeCompare(a[orderBy.key]);
        }   
    });

    // Tartalom renderelése
    table.querySelector('tbody').innerHTML = data.reduce((html, item) => html + '<tr>' + 
        structure.reduce((row, kind) => row + 
            `<td>${kind.format ? kind.format(item[kind.key]) : item[kind.key]}</td>`, '') + 
            `<td class="buttons"><button class="item-delete" title="Törlés" data-id="${item['id']}">T</button> <button class="item-edit" title="Szerkesztés" data-id="${item['id']}">Sz</button></td>` +
        '</tr>', '');

    // Mindeféle eseményfigyelők létrehozása - minden renderelésnél váltiozik a DOM, keretrendszer nélkül így a megúszós
    // Fejléc - sorbarendezés
    Array.from(table.querySelectorAll('.sortable')).forEach((el) => {
        el.addEventListener('click', () => {
            // Melyik oszlop?
            const col = tableStructure.find((item) => item.key === el.dataset.key);
            // Itt csak az adatszerkezezetben módosjtjuk a sorbarendezést
            if (!col.order) { // Ha nem ez volt eddig sorbarendezve
                delete tableStructure.find((item) => item.order).order;
                col.order = 'asc';
            } else if (col.order === 'asc') { // Ha ez volt növekvőben
                col.order = 'desc';
            }
            else { // Ha ez volt csökkenőben
                col.order = 'asc';
            }
            // Majd újrarendereljük a táblát
            renderTable(store.getItems(), tableStructure);
        });
    });

    // CRUD - Delete
    Array.from(table.querySelectorAll('.item-delete')).forEach((el) => {
        el.addEventListener('click', () => {
            // Egyszerű: a storage kezeli a törlést, a módosítás után automatikusan újrarenderelődik a táblázat
            store.deleteItem(el.dataset.id);
        });
    });

    // CRUD - Edit
    Array.from(table.querySelectorAll('.item-edit')).forEach((el) => {
        el.addEventListener('click', () => {
            // A modal kezeli innentől
            openModal(el.dataset.id);
        });
    });
}

// Storage megoldás
const store = new webStorage('webprog1-ea', initialData);

// Ha betöltődött az oldal
renderTable(store.getItems(), tableStructure);

// Figyeljük, hogy változik-e a storage, ha igen újrarendereljük a rtáblázatot
store.on("updated", () => {
    renderTable(store.getItems(), tableStructure);
});

// Felugró ablak kezelése

function openModal(id = null) {
    // Űrlap kitöltése ha van id
    if(id) {
        let form = document.getElementById('tablazat-edit').elements
        const item = store.readItem(id);
        Object.entries(item).forEach(([key, value]) => form.namedItem(key) && (form.namedItem(key).value = value));
    }
    document.getElementById('tablazat-modal').classList.remove('hidden');
}

function closeModal() {
    // TODO: Űrlap ürítése
    document.getElementById('tablazat-edit').reset();
    document.getElementById('tablazat-modal').classList.add('hidden');
}

// Bezárás figyelése
document.getElementById('tablazat-modal').addEventListener('click', () => closeModal());
document.getElementById('close-modal').addEventListener('click', () => closeModal());

// Új elem gomb figyelése
document.getElementById('new-item').addEventListener('click', () => openModal());

// Űrlap kezelése
function onSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('tablazat-edit');
    const formData = new FormData(form);

    // Ha van ID frisstünk, ha nincs újat hozunk létre
    if(formData.get('id')) {
        store.updateItem(Array.from(formData.entries()).reduce((prev, [key, value]) => ({...prev, [key]: value}), {})); // A JS csodái...
    }
    else {
        store.createItem(Array.from(formData.entries()).reduce((prev, [key, value]) => ({...prev, [key]: value}), {}));
    }
    closeModal();
}

// Űrlapküldés figyelése
document.getElementById('tablazat-edit').addEventListener('submit', onSubmit);

// Selectek feltöltése adatokkal
const form = document.getElementById('tablazat-edit').elements;

restaurantTypes.forEach(data => {
    const newOption = document.createElement("option");
    newOption.value = data.id;
    newOption.text = data.title;
    form.namedItem('type').add(newOption, null);
});
