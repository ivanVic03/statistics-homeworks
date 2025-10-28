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

function simulateTrial(p) {
    if (Math.random() < p) {
        return 1;
    }
    else return 0;
}

function simulateTrajectory(p, n) {
    let x = 0;
    let y = 0;
    const points = [];

    for (let i = 0; i < n; i++) {
        const result = simulateTrial(p);
        if (result === 1) {
            x += 1;
            y += 1;
        } else {
            y += 1;
        }
        points.push({x, y});
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
    currentIndex = (currentIndex + 1) % trajectories.length;
    drawTrajectory(currentIndex);
    document.getElementById('trajectoryInfo').textContent =
        `Trajectory ${currentIndex + 1} of ${trajectories.length}`;
}

function prevTrajectory() {
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
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: 1,
            }]
        },
        options: {
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
            datasets: [{
                data: data.map(p => p.y),
                fill: false,
                borderColor: 'black',
                borderWidth: 1,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'X position' } },
                y: { title: { display: true, text: 'Y position' }, beginAtZero: true }
            }
        }
    });
}


function startSimulation() {
    p = parseFloat(document.getElementById("p").value);
    m = parseFloat(document.getElementById("m").value);
    n = parseFloat(document.getElementById("n").value);

    bins = parseFloat(document.getElementById("bins").value);
    trajectories = generateTrajectories(p, n, m);
    finalFreqs = trajectories.map(t => t[t.length - 1].x / t[t.length - 1].y);
    currentIndex = 0;

    drawTrajectory(currentIndex);
    document.getElementById('trajectoryInfo').textContent = `Trajectory ${currentIndex + 1} of ${trajectories.length}`;
    drawHistogram(finalFreqs, bins);

}

function toggleAutoScroll() {
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