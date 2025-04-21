// Web Storage feladat
import webStorage from './webStorage.js';

// Storage megoldás
const store = new webStorage('webprog1-ea', []);

// Ha betöltődött az oldal
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('#storageLength').innerHTML = store.length();
    document.querySelector('#truncateStore').onclick = () => {
        store.truncate();
        document.querySelector('#storageLength').innerHTML = store.length();
    };
    document.querySelector('#deleteStore').onclick = () => {
        store.destroy();
        document.querySelector('#storageLength').innerHTML = '<em>localStorage törölve...<em>';
    };
});