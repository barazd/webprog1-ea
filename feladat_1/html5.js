// Web Storage feladat

function getStorageInfo(query = '#storage-info') {
    const storages = { ...localStorage }; // Összes storage sima objektumként

    const ul = document.querySelector(query);
    ul.innerHTML = ''; // töröljük ha volt benne bármi

    Object.entries(storages).forEach(([key, value]) => {
        const li = document.createElement('li');
        li.innerText = `${key} (${JSON.parse(value).length} db elem)`;

        const truncateButton = document.createElement('button');
        truncateButton.innerText = 'Kiürtés';
        truncateButton.addEventListener('click', () => {
            localStorage.setItem(key, JSON.stringify([]));
            getStorageInfo(query);
        });
        li.appendChild(truncateButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Storage törlése';
        deleteButton.addEventListener('click', () => {
            localStorage.removeItem(key);
            getStorageInfo(query)
        });
        li.appendChild(deleteButton);

        ul.appendChild(li);
    });
}

getStorageInfo('#storage-info');

// Web worker feladat

if (window.Worker) {
    const worker = new Worker("worker.js");

    const workerForm = document.getElementById('worker');

    // Üzenet küldése
    workerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        worker.postMessage([e.target.elements.namedItem('n1').value, e.target.elements.namedItem('n2').value, e.target.elements.namedItem('op').value]);
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
                Object.entries(data.address).reduce((html, [key, value]) => html + `<li><strong>${key}:</strong> ${value}</li>`, '')
                + '</ul>';
        });
}

// SSE feladat

if (window.EventSource) {
    const sse = new EventSource("https://webprog1-sse.dome.baraz.hu/stream");
    const sseResult = document.getElementById('sse-result');

    sse.addEventListener('message', function (event) {
        sseResult.value += event.data + '\n';
    });
}

// Drag and Drop feladat
document.querySelectorAll(".draggable").forEach(draggable => {
    // Megragad
    draggable.addEventListener("dragstart", function () {
        this.classList.add("dragging");
    });
    // Elenged
    draggable.addEventListener("dragend", function () {
        this.classList.remove("dragging");
    });
});

document.querySelectorAll(".dnd-container").forEach(container => {
    container.addEventListener("dragover", function () {
        const draggedElement = document.querySelector(".dragging");
        this.appendChild(draggedElement);
    });
});

// Canvas feladat

const canvas = document.getElementById('canvas-result');

function getRandomColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

function drawCanvas(canvas) {
    const ctx = canvas.getContext('2d');

    // Hom'lzos eredm;nz javt'si kis;rlet
    ctx.imageSmoothingQuality = 'high';

    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * (30 - 5) + 5, 0, 2 * Math.PI);
        ctx.fillStyle = getRandomColor();
        ctx.fill();
    }
}

document.getElementById('canvas-add').addEventListener('click', () => drawCanvas(canvas));

// SVG feladat

const svg = document.getElementById('svg-result');

function drawSVG(canvas) {
    for (let i = 0; i < 5; i++) {
        canvas.innerHTML += (`<circle cx="${Math.random() * canvas.clientWidth}" cy="${Math.random() * canvas.clientHeight}" r="${Math.random() * (30 - 5) + 5}" fill="${getRandomColor()}" />`);
    }
}

document.getElementById('svg-add').addEventListener('click', () => drawSVG(svg));