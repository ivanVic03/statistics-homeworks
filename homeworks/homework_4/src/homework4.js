let p = 0;
let m = 0;
let n = 0;
let trajectories = [];
let currentIndex = 0;

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
    let trajectories = [];
    for (let i = 0; i < n; i++) {
        trajectories.push(simulateTrajectory(p,n));
    }
    return trajectories;
}

function startSimulation() {
    p = parseFloat(document.getElementById("p").value);
    m = parseFloat(document.getElementById("m").value);
    n = parseFloat(document.getElementById("n").value);

    trajectories = generateTrajectories(p, n, m);
    currentIndex = 0;

    const ctxMain = document.getElementById("mainChart").getContext("2d");
    if (window.mainChart) {
        window.mainChart.destroy()
    }
    window.mainChart = new Chart(ctxMain, {
        type: 'line',
        data: {
            labels: Array.from({ length: n }, (_, i) => i+1),
            datasets: [{
                label: `Traiettoria ${currentIndex + 1}`,
                data: trajectories[currentIndex],
                borderColor: 'blue',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Law of large numbers simulation',
            },
            scales: {
                x: {title: {display: true, text: 'Number of trials (n)'}},
                y: {title: {display: true, text: 'Frequency'}}, min: 0
            }
        }
    });
}

function updateChart() {
    window.mainChart.data.datasets[0].data = trajectories[currentIndex];
    window.mainChart.data.datasets[0].label = `Traiettoria ${currentIndex + 1}`
    window.mainChart.update()
}

function nextTrajectory() {
    if (currentIndex < m-1) {
        currentIndex += 1;
    }
    else {
        currentIndex = 0;
    }
    updateChart()
}

function prevTrajectory() {
    if (currentIndex > 0) {
        currentIndex -= 1;
    }
    else {
        currentIndex = m - 1;
    }
    updateChart()
}