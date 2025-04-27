import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/+esm';

Chart.register(...registerables);

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

// Táblázat
const table = document.querySelector('#table');

// Ha kattintunk a jelmagyarázaton, akkor a checkbox-ok kövessék azt
const handleChartClick = (event, legendItem, legend) => {
    // A checkbox állítása
    Array.from(table.querySelectorAll('input[type=checkbox]')).forEach((el) => {
        if (el.value == legendItem.datasetIndex) {
            el.checked = legendItem.hidden;
        }
    });
    // Csinálja meg, amit eredetileg csinálna
    legend.chart.data.datasets[legendItem.datasetIndex].hidden = !legendItem.hidden;
    legend.chart.update();
}

// Chart.js

const ctx = document.getElementById('chart');

const cfg = {
    type: 'line',
    data: {
        labels: getRandomDataset(length).sort((a, b) => a - b),
        datasets: new Array(length).fill().map(() => new Object({
            data: getRandomDataset(),
            label: 'L' + getRandomColor().slice(-2).toUpperCase(),
            borderColor: getRandomColor(),
            tension: 0.4,
            fill: false,
            hidden: false,
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
        },
        plugins: {
            legend: {
                onClick: handleChartClick
            }
        }
    }
};

const chart = new Chart(ctx, cfg);

// Adatokat tartalmazó táblázat

table.querySelector('thead').innerHTML = '<tr>' + 
    '<th></th><th>Adatsor</th>' +
    cfg.data.labels.reduce((row, label) => row + 
        `<th>${label}</th>`, '') + 
    '</tr>';

    table.querySelector('tbody').innerHTML = cfg.data.datasets.reduce((html, dataset, index) => html + '<tr>' + 
        `<td style="background:${dataset.borderColor}"><input type="checkbox" value="${index}" ${dataset.hidden ? '' : 'checked'}></td>` + 
        `<td><strong>${dataset.label}</strong></td>` +
        dataset.data.reduce((row, item) => row + 
        `<td>${item}</td>`, '') + 
    '</tr>', '');

// Eseményfigyelő ha a checkbox-okat változtatjuk
Array.from(table.querySelectorAll('input[type=checkbox]')).forEach((el) => {
    el.addEventListener('change', (event) => {
        // A checkbox-nak megfelelően frissítjük a chart-ot
        chart.data.datasets[event.target.value].hidden = !event.target.checked;
        chart.update();
    });
});