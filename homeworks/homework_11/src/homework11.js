let simulationChart = null;
let histogramChart = null;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('time').value = ''
    document.getElementById('steps').value = ''
    document.getElementById('sigma').value = ''
    simulationChart = null
    histogramChart = null
});

function updateUIForModel() {
    const type = document.getElementById('modelType').value;
    const y0 = document.getElementById('y0');
    const mu = document.getElementById('mu');
    const sigma = document.getElementById('sigma');

    if (type == 'GBM') {
        y0.value = 100;
        mu.value = 0.05;
        sigma.value = 0.2;
    }
    else {
        y0.value = 0;
        mu.value = 0;
        sigma.value = 1;
    }
}

function standardNormal() {
    let u1 = Math.random()
    let u2 = Math.random()
    let z = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2)
    return z;
}

function simulateSDE(type, T, n, mu, sigma, y0) {
    const dt = T/n
    const sqrtDt = Math.sqrt(dt);
    const y_array = [y0];
    let Yt = y0;

    for (let i = 0; i < n; i++) {
        let z = standardNormal();
        let dW = Z*sqrtDt
        let drift, diffusion;

        if (type =='GBM') {
            drift = mu*Yt*dt
            diffusion = sigma*Yt*dW
        }
        else {
            drift = mu*dt;
            diffusion = sigma*dW
        }
        Yt = Yt + drift + diffusion
        y_array.push(Yt);
    }
    return y_array;
}

function simulateBrownianMotion(T, n, sigma) {
    const sqrtDt = Math.sqrt(T/n);
    const y_array = [0]
    let Yt = 0;
    for (let i = 0; i < n; i++) {
        let Z = standardNormal()
        Yt = Yt + (sigma*Z*sqrtDt)
        y_array.push(Yt)
    }
    return y_array
}

function drawChart(data, T, n) {
    const ctx = document.getElementById('brownianMotionSim').getContext("2d");
    if (!ctx) {
        alert("No ctx found.");
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (simulationChart) {
        simulationChart.destroy();
    }
    const labels = [];
    const dt = T / n;
    for (let i = 0; i <= n; i++) {
        labels.push((i * dt).toFixed(2));
    }
    const datasets = data.map((path, index) => ({
        label: `Simulation ${index}`,
        data: path,
        borderColor: "midnightblue",
        borderWidth: 1,
        pointRadius: 0,
        tension: 0,
        fill: false,
    }));

    simulationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            interaction: {mode: 'nearest', axis: 'x', intersect: false},
            plugins: {
                legend: {display: false},
                tooltip: {enabled: false},
            },
            scales: {
                x: {
                    ticks: {maxTicksLimit: 10},
                    title: {display: true, text: 'Time (t)'},
                },
                y: {
                    title: {display: true, text: 'Value (Yt)'},
                }
            }
        }
    });
}

function drawHistogram(finalPositions, T, mu, sigma, y0, type) {
    const ctx = document.getElementById('histogramCanvas').getContext('2d');
    if (histogramChart) histogramChart.destroy();

    // Calculate Stats
    const numSims = finalPositions.length;
    const mean = finalPositions.reduce((a, b) => a + b, 0) / numSims;

    // Setup Bins
    const minVal = Math.min(...finalPositions);
    const maxVal = Math.max(...finalPositions);
    const range = maxVal - minVal;
    const binCount = 50;
    const binWidth = range / binCount;

    const bins = new Array(binCount).fill(0);
    const labels = [];

    for (let i = 0; i < binCount; i++) {
        let center = minVal + (i + 0.5) * binWidth;
        labels.push(center.toFixed(2));
    }

    for (let val of finalPositions) {
        let idx = Math.floor((val - minVal) / binWidth);
        if (idx >= binCount) idx = binCount - 1;
        bins[idx]++;
    }

    let datasets = [{
        type: 'bar',
        data: bins,
        label: 'Observed Frequency',
        backgroundColor: 'midnightblue',
        barPercentage: 1.0,
        categoryPercentage: 1.0
    }];

    if (type === 'BM' && mu === 0) {
        const theoryData = [];
        const theoreticalStdDev = sigma * Math.sqrt(T);
        const variance = theoreticalStdDev ** 2;

        for (let i = 0; i < binCount; i++) {
            let x = parseFloat(labels[i]);
            // PDF formula
            let pdf = (1 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(-(x ** 2) / (2 * variance));
            // Scale PDF to match histogram counts: pdf * binWidth * totalSamples
            theoryData.push(pdf * binWidth * numSims);
        }

        datasets.unshift({
            type: 'line',
            label: 'Theoretical Normal',
            data: theoryData,
            borderColor: 'crimson',
            borderWidth: 2,
            pointRadius: 0
        });
    }

    histogramChart = new Chart(ctx, {
        data: { labels: labels, datasets: datasets },
        options: {
            responsive: true,
            scales: {
                x: { title: {display: true, text: 'Final Value'}, ticks: {maxTicksLimit: 10} },
                y: { title: {display: true, text: 'Frequency'} }
            }
        }
    });
}

function runSimulation() {
    const T = parseFloat(document.getElementById('time').value);
    const n = parseFloat(document.getElementById('steps').value);
    const sigma = parseFloat(document.getElementById('sigma').value);
    const mu = parseFloat(document.getElementById('mu').value);
    const y0 = parseFloat(document.getElementById('y0').value);
    const type = document.getElementById('modelType').value;

    if (!T || !n || !sigma) {
        alert("Please enter valid parameters.");
        return;
    }

    document.getElementById('result-section').style.display = 'block';

    const numTrajectories = 2000;
    const data = [];
    const finalPositions = [];

    for (let k = 0; k < numTrajectories; k++) {
        const path = simulateSDE(type, T, n, mu, sigma, y0);
        data.push(path);
        finalPositions.push(path[path.length - 1]);
    }
    drawChart(data, T, n);
    drawHistogram(finalPositions, T, mu, sigma, y0, type);
}