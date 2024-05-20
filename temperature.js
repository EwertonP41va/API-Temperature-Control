import Chart from 'chart.js/auto';

const apiUrl = 'http://localhost/dsi/aula-3/apirest.php/readings';
const unidade = document.getElementById('unidade');
const curso = document.getElementById('curso');

const dataTable = document.querySelector('#data-table tbody');
const tempChartCtx = document.getElementById('temp-chart').getContext('2d');
const humidityChartCtx = document.getElementById('humidity-chart').getContext('2d');
const avgTempChartCtx = document.getElementById('avg-temp-chart').getContext('2d');
const avgHumidityChartCtx = document.getElementById('avg-humidity-chart').getContext('2d');

const fetchReadings = async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.slice(-20); // Get last 20 readings
}

const renderTable = (readings) => {
    dataTable.innerHTML = readings.map(reading => `
        <tr>
            <td>${new Date(reading.timestamp).toLocaleString()}</td>
            <td>${reading.temperatura}</td>
            <td>${reading.umidade}</td>
        </tr>
    `).join('');
}

const renderCharts = (readings) => {
    const labels = readings.map(r => new Date(r.timestamp).toLocaleString());
    const temperatures = readings.map(r => r.temperatura);
    const humidities = readings.map(r => r.umidade);

    new Chart(tempChartCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Temperatura (°C)',
                data: temperatures,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            }]
        },
    });

    new Chart(humidityChartCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Umidade (%)',
                data: humidities,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            }]
        },
    });

    const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    new Chart(avgTempChartCtx, {
        type: 'bar',
        data: {
            labels: ['Média de Temperatura (°C)'],
            datasets: [{
                label: 'Temperatura',
                data: [avgTemp],
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
    });

    const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;
    new Chart(avgHumidityChartCtx, {
        type: 'bar',
        data: {
            labels: ['Média de Umidade (%)'],
            datasets: [{
                label: 'Umidade',
                data: [avgHumidity],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
    });
}

const initDashboard = async () => {
    const readings = await fetchReadings();
    renderTable(readings);
    renderCharts(readings);
}

initDashboard();
