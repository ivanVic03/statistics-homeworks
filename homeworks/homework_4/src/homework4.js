let p = 0;
let m = 0;
let n = 0;
let bins = 0;
let trajectories = [];
let finalFreqs = [];
let currentIndex = 0;
let trajectoryChart = null;
let histogramChart = null;

let autoscroll = false;
let autoscrollInterval = null;

window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("p").value = '';
    document.getElementById("m").value = '';
    document.getElementById("bins").value = '';
    document.getElementById("n").value = '';
    trajectories = [];
    finalFreqs = [];
    currentIndex = 0;
    trajectoryChart = null;
    histogramChart = null;
    autoscroll = false;
    autoscrollInterval = null
})

function simulateTrial(p) {
    if (Math.random() < p) {
        return 1;
    }
    else return 0;
}

function simulateTrajectory(p, n) {
    let successes = 0;
    const points = [];

    for (let i = 1; i <= n; i++) {
        const result = simulateTrial(p);
        successes += result;
        points.push({ x: i, y: successes/i });
    }

    return points;
}


function generateTrajectories(p, n, m) {
    const trajectories = [];
    for (let i = 0; i < m; i++) {
        trajectories.push(simulateTrajectory(p, n));
    }
    return trajectories;
}


function nextTrajectory() {
    if (!trajectories || trajectories.length === 0) {
        alert('No trajectories found. Please run the simulation first!');
        return;
    }
    currentIndex = (currentIndex + 1) % trajectories.length;
    drawTrajectory(currentIndex);
    document.getElementById('trajectoryInfo').textContent =
        `Trajectory ${currentIndex + 1} of ${trajectories.length}`;
}

function prevTrajectory() {
    if (!trajectories || trajectories.length === 0) {
        alert('No trajectories found. Please run the simulation first!');
        return;
    }
    currentIndex = (currentIndex - 1 + trajectories.length) % trajectories.length;
    drawTrajectory(currentIndex);
    document.getElementById('trajectoryInfo').textContent =
        `Trajectory ${currentIndex + 1} of ${trajectories.length}`;
}


function computeHistogram(dataArray, bins) {
    const counts = new Array(bins).fill(0);
    const minVal = 0;
    const maxVal = 1;
    const width = (maxVal - minVal) / (bins);
    dataArray.forEach(val => {
        let idx = Math.floor((val - minVal) / width);
        if (idx >= bins) idx = bins - 1;
        counts[idx]++;
    });
    const labels = counts.map((_, i) => {
        const start = (minVal + i*width).toFixed(2);
        const end = (minVal + (i+1)*width).toFixed(2);
        return `${start}–${end}`
    });
    return {counts, labels};
}

function drawHistogram(finalFreqs, bins) {
    const histogram = computeHistogram(finalFreqs, bins);
    const ctx = document.getElementById('histogram').getContext('2d');
    if (histogramChart) {
        histogramChart.destroy();
    }
    histogramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: histogram.labels,
            datasets: [{
                label: 'Final distribution f(n)',
                data: histogram.counts,
                backgroundColor: 'steelblue',
                borderColor: 'black',
                borderWidth: 1,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {title: {display: true, text: 'f(n) ranges'}},
                y: {title: {display: true, text: 'Number of trajectories'}, beginAtZero: true}
            }
        }
    });
}

function drawTrajectory(index) {
    const data = trajectories[index];
    const ctx = document.getElementById('mainChart').getContext('2d');

    if (trajectoryChart) trajectoryChart.destroy();

    trajectoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(p => p.x),
            datasets: [
                {
                    label: 'Trial result',
                    data: data.map(p => p.y),
                    fill: false,
                    borderColor: 'steelblue',
                    borderWidth: 2,
                    pointRadius: 0,
                    stepped: false,
                    tension: 0.2
                },
                {
                    label: 'Theoretical probability p',
                    data: Array(data.length).fill(p),
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 0,
                    borderDash: [5,5],
                }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Number of trials (n)' } },
                y: { title: { display: true, text: 'Relative frequency' }, beginAtZero: true, max: 1 }
            }
        }
    });
}


function startSimulation() {
    p = parseFloat(document.getElementById("p").value);
    m = parseFloat(document.getElementById("m").value);
    n = parseFloat(document.getElementById("n").value);

    trajectories = generateTrajectories(p, n, m);
    currentIndex = 0;

    drawTrajectory(currentIndex);
    document.getElementById('trajectoryInfo').textContent = `Trajectory ${currentIndex + 1} of ${trajectories.length}`;
}

function toggleAutoScroll() {
    if (!trajectories || trajectories.length === 0) {
        alert('No trajectories found. Please run the simulation first!');
        return;
    }
    const btn = document.getElementById('autoScrollBtn');
    if (!autoscroll) {
        autoscroll = true;
        btn.textContent = "Stop scrolling";
        autoscrollInterval = setInterval(() => {
            nextTrajectory();
        }, 1500)
    }
    else {
        autoscroll = false;
        btn.textContent = "Automatic scroll";
        clearInterval(autoscrollInterval);
    }
}

function startHistogram() {
    if (!trajectories || trajectories.length === 0) {
        alert('No trajectories found. Please run the simulation first!');
        return;
    }

    bins = parseFloat(document.getElementById("bins").value);

    if (!bins || bins < 1) {
        alert('Please enter a valid number of bins, greater than 1');
    }

    finalFreqs = trajectories.map(t => t[t.length - 1].y);
    drawHistogram(finalFreqs, bins);

}