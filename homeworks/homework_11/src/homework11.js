let simulationChart = null;
let histogramChart = null;

window.addEventListener("DOMContentLoaded", function() {})

function standardNormal() {
    let u1 = Math.random()
    let u2 = Math.random()
    let z = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2)
    return z;
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

function drawChart(data) {
    const canvas = document.getElementById('brownianMotionSim');
    if (!canvas) {
        alert("No canvas found.");
        return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        alert("No ctx found.");
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (simulationChart) {
        simulationChart.destroy();
    }
    const labels = data[0].map((_, i) => i*(T/n)).toFixed(2);
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
            maintainAspectRatio: false,
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

function drawHistogram(finalPositions, T, sigma) {
    const ctx = document.getElementById('histogramCanvas').getContext('2d');
    if (!ctx) {
        alert("No canvas found.");
        return;
    }
    if (histogramChart) {
        histogramChart.destroy();
    }
    const numSims = finalPositions.length;
    const theoreticalStdDev = sigma*Math.sqrt(T)
    const limit = 4*theoreticalStdDev;
    const binCount = 50;
    const min = -limit
    const max = limit
    const binWidth = (max - min) / binCount;
    const labels = [];
    const theoryData = [];
    const emphricalData = new Array(binCount).fill(0);
    for (let i = 0; i < binCount; i++) {
        const center = min + (i + 0.5)*binWidth;
        labels.push(center.toFixed(2));
        const variance = theoreticalStdDev ** 2;
        const pdf = (1 / Math.sqrt(2*Math.PI*variance))* Math.exp(-(center**2) / (2*variance));
        theoryData.push(pdf*binWidth*numSims);
    }

    for (let val of finalPositions) {
        if (val >= min && val < max) {
            const idx = Math.floor((val - min) / binWidth);
            emphricalData[idx]++;
        }
    }

    histogramChart = new Chart(ctx, {
        data: {
            labels: labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Theoretical Normal',
                    data: theoryData,
                    borderColor: 'crimson',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    tension: 0.4,
                },
                {
                    type: 'bar',
                    data: emphricalData,
                    labels: 'Observed Points',
                    backgroundColor: 'midnightblue',
                    barPercentage: 1.0,
                    categoryPercentage: 1.0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    ticks: {maxTicksLimit: 10},
                    title: {display: true, text: 'Final Position'},
                },
                y: {
                    title: {display: true, text: 'Frequency'},
                }
            }
        }
    })

}

function runSimulation() {
    const T = parseFloat(document.getElementById('time').value);
    const n = parseFloat(document.getElementById('steps').value);
    const sigma = parseFloat(document.getElementById('sigma').value);

    if (!T || !n || !sigma) {
        alert("Please enter valid parameters.");
        return;
    }

    document.getElementById('result-section').style.display = 'block';

    const numTrajectories = 50;
    const data = [];
    const finalPositions = [];

    for (let k = 0; k < numTrajectories; k++) {
        const path = simulateBrownianMotion(T, n, sigma);
        data.push(path);
        finalPositions.push(path[path.length - 1]);
    }
    drawChart(data);
    drawHistogram(finalPositions, T, sigma);
}