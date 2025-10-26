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
    let successes = 0;
    let frequencies = [];
    for (let i = 0; i < n; i++) {
        successes += simulateTrial(p);
        frequencies.push(successes / i);
    }
    return frequencies;
}

function generateTrajectories(p,n,m) {
    const trajectories = [];
    for (let i = 0; i < n; i++) {
        trajectories.push(simulateTrajectory(p,n));
    }
    return trajectories;
}

function updateChart() {
    window.mainChart.data.datasets[0].data = trajectories[currentIndex];
    window.mainChart.data.datasets[0].label = `Traiettoria ${currentIndex + 1}`
    window.mainChart.update()
}

function nextTrajectory() {
    currentIndex = (currentIndex + 1) % trajectories.length;
    drawTrajectory(currentIndex);
    updateChart()
}

function prevTrajectory() {
    currentIndex = (currentIndex - 1  + trajectories.length) % trajectories.length;
    drawTrajectory(currentIndex);
    updateChart()
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
    const ctx = document.getElementById('trajectoryChart').getContext('2d');

    if (trajectoryChart) {
        trajectoryChart.destroy()
    }

    trajectoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: data.length}, (_, i) => i+1),
            datasets: [{
                data: data,
                fill: false,
                borderColor: 'black',
                borderWidth: 1,
                tension: 0.2,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {title: {display: true, text: 'Number of trials (n)'}},
                y: {title: {display: true, text: 'Frequency f(n)'}, min: 0},
            }
        }
    });
}

function startSimulation() {
    p = parseFloat(document.getElementById("p").value);
    m = parseFloat(document.getElementById("m").value);
    n = parseFloat(document.getElementById("n").value);

    bins = parseFloat(document.getElementById("bin").value);
    trajectories = generateTrajectories(p, n, m);
    finalFreqs = trajectories.map(t => t[t.length - 1]);
    currentIndex = 0;

    drawTrajectory(currentIndex);
    drawHistogram(finalFreqs, bins);
}

function toggleAutoscroll() {
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