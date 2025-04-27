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

// Geolocation-ös feladat

const geocodeResult = document.getElementById('geocode-result');

document.getElementById('geocode-get').addEventListener('click', getLocation);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getGeocode);
    }
    else {
        geocodeResult.innerHTML = '<p><strong>A geolokáció le van tiltva!</strong></p>';
    }
}

function getGeocode(postion) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${postion.coords.latitude}&lon=${postion.coords.longitude}&zoom=16&format=json`)
    .then(response => response.json())
    .then(data => {
        geocodeResult.innerHTML = '<ul>' + 
            Object.entries(data.address).reduce((html, [key, value]) => html +`<li><strong>${key}:</strong> ${value}</li>`, '')
        + '</ul>';
    });
}