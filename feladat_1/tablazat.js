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
    { title: 'Település', order: 'desc', key: 'city',  sortable: true },
    { title: 'Típus', key: 'type', format: (data) => restaurantTypes.find((item) => item.id === data).title },
    { title: 'Értékelés', key: 'rating',  sortable: true, format: (data) => `${data}/10` },
];

// Táblázat kirajzolása
function renderTable(data, structure) {
    const table = document.querySelector('#restaurants');
    // Fejléc renderelése
    table.querySelector('thead').innerHTML = '<tr>' + structure.reduce((row, kind) => row + `<th class="${kind.sortable ? 'sortable' : ''} ${kind.order || ''}" data-key="${kind.key}" onclick="sortTable(this)">${kind.title}</th>`, '') + '</tr>';

    // Tartalom sorbarendezése
    const orderBy = structure.find((item) => item.order);
    data = data.sort((a, b) => orderBy.order === 'asc' ? a[orderBy.key].localeCompare(b[orderBy.key]) : b[orderBy.key].localeCompare(a[orderBy.key]));

    // Tartalom renderelése
    table.querySelector('tbody').innerHTML = data.reduce((html, item) => html + '<tr>' + structure.reduce((row, kind) => row + `<td>${kind.format ? kind.format(item[kind.key]): item[kind.key]}</td>`, '') + '</tr>', '');
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

    // Sorbarendezés
    const table = document.querySelector('#restaurants thead');
    Array.from(document.getElementsByClassName('.sortable')).forEach((el) => {
    //document.querySelectorAll('#restaurants th.sortable').forEach((el) => {
        
        console.log(el);
        el.addEventListener('click', () => {
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
        });
    });
//});//