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

// Táblázat kirajzolása
function renderTable(data) {
    const table = document.querySelector('#restaurants > tbody');

    table.innerHTML = data.reduce((html, item) => html + '<tr>' + Object.keys(item).reduce((row, key) => row + `<td>${item[key]}</td>`, '') + '</tr>', '');
}

// Storage megoldás
const store = new webStorage('webprog1-ea', initialData);

// Ha betöltődött az oldal
document.addEventListener("DOMContentLoaded", () => {
    renderTable(store.getItems());

    store.on("updated", () => {
        renderTable(store.getItems());
    });
});