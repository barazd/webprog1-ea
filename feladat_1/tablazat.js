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
    { title: 'Típus', key: 'type', format: (data) => restaurantTypes.find((item) => item.id === data).title },
    { title: 'Értékelés', key: 'rating', sortable: true, format: (data) => `${data}/10` },
];

// Táblázat kirajzolása
function renderTable(data, structure) {
    const table = document.querySelector('#restaurants');
    // Fejléc renderelése
    table.querySelector('thead').innerHTML = '<tr>' + structure.reduce((row, kind) => row + `<th class="${kind.sortable ? 'sortable' : ''} ${kind.order || ''}" data-key="${kind.key}">${kind.title}</th>`, '') + '</tr>';

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
    table.querySelector('tbody').innerHTML = data.reduce((html, item) => html + '<tr>' + structure.reduce((row, kind) => row + `<td>${kind.format ? kind.format(item[kind.key]) : item[kind.key]}</td>`, '') + '</tr>', '');

    // Sorbarendezés eseményfigyelők létrehozása - minden renderelésnél váltiozik a DOM, keretrendszer nélkül így a megúszós
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
}

// Storage megoldás
const store = new webStorage('webprog1-ea', initialData);

// Ha betöltődött az oldal
//document.addEventListener('DOMContentLoaded', () => {
renderTable(store.getItems(), tableStructure);

store.on("updated", () => {
    renderTable(store.getItems(), tableStructure);
});

// Sorbarendezés
export const sortTable = (el) => {
    console.log('hopp');
    const col = tableStructure.find((item) => item.key === el.dataset.key);

    if (!col.order) { // Ha nem ez volt eddig sorbarendezve
        delete tableStructure.find((item) => item.order).order;
        col.order = 'asc';
    } else if (col.order === 'asc') { // Ha ez volt növekvőben
        col.order = 'desc';
    }
    else { // Ha ez volt csökkenőben
        col.order = 'asc';
    }
    renderTable(store.getItems(), tableStructure);
}