import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/+esm';

Chart.register(...registerables);

const ctx = document.getElementById('chart');

// Random adatsor generálók
function getRandomDataset(length = 5, min = 5, max = 50) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min) + min));
}
function getRandomColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}
function getRandomLabel() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

// Adatok mennyisége
const length = 5;

new Chart(ctx, {
    type: 'line',
    data: {
        labels: getRandomDataset(length).sort((a, b) => a - b),
        datasets: new Array(length).fill().map(() => new Object({
            data: getRandomDataset(),
            label: 'L' + getRandomColor().slice(-2).toUpperCase(),
            borderColor: getRandomColor(),
            fill: false
        }))
    },
    options: {
        title: {
            display: true,
            text: "Véletlenszerű adatok",
        },
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    }
});