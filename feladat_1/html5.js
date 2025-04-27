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


// Web worker feladat

if (window.Worker) {
    const worker = new Worker("worker.js");

    const workerForm = document.getElementById('worker');

    // Üzenet küldése
    workerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log([e, e.target.elements.namedItem('n1').value,  e.target.elements.namedItem('n2').value,  e.target.elements.namedItem('op').value])
        worker.postMessage([e.target.elements.namedItem('n1').value,  e.target.elements.namedItem('n2').value,  e.target.elements.namedItem('op').value]);
    });

    // Üzenet fogadása
    worker.onmessage = (e) => {
        document.getElementById('worker-result').value += e.data;
    };
}
  