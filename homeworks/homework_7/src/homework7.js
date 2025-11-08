let p = 0;
let attackers = 0;
let weeks = 0;
let trajectories = [];
let trajectoryChart = null;
let histogramChart = null;
let currentIndex = 0;

let autoscroll = false;
let autoscrollInterval = null;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('probability').value = '';
    document.getElementById('attackers').value = '';
    document.getElementById('weeks').value = '';
    trajectories = [];
    currentIndex = 0;
    trajectoryChart = null;
    histogramChart = null;
    autoscroll = false;
    autoscrollInterval = null;
})

function weeklyStep(p) {
    return Math.random() < p ? -1: +1;
}

function generateTrajectories(weeks, attackers, p) {
    const results = [];
    for (let i = 0; i < attackers; i++) {
        let cumulative = 0;
        const path = [0];

        for (let j = 0; j < weeks; j++) {
            const breach = weeklyStep(p);
            cumulative += breach;
            path.push(cumulative);
        }
        results.push(path);
    }
    return results;
}

function drawSingleTrajectory(index) {
    const path = trajectories[index];
    const ctx = document.getElementById('mainChart').getContext('2d');

    if (trajectoryChart) {
        trajectoryChart.destroy()
    }

    trajectoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: path.length}, (_, i) => i),
            datasets: [
                {
                    label: `Attack simulation`,
                    data: path,
                    fill: false,
                    borderColor: 'steelblue',
                    tension: 0.2,
                    pointRadius: 0,
                },
            ],
        },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    x: { title: {display: true, text: "Week"}},
                    y: { title: {display: true, text: "Score"}, beginAtZero: true},
                },
            },
    });
}

function drawAllTrajectories() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    if (trajectoryChart) {
        trajectoryChart.destroy()
    }

    const datasets = trajectories.map((path, i)=> ({
        data: path,
        fill: false,
        borderColor: 'lightgray',
        tension: 0.1,
        borderWidth: 1,
    }));

    for (let i = 0; i < datasets.length; i++) {
        if (i % 2 === 0) {
            datasets[i].borderColor = 'red';
        }
        else {
            datasets[i].borderColor = 'black';
        }
    }

    trajectoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: trajectories[0].length}, (_, i) => i),
            datasets,
        },
        options: {
            responsive: true,
            animation: false,
            plugins: {
                legend: {display: false},
                title: {
                    display: true,
                    text: "All Trajectories - Random Walk of Server Security",
                },
            },
            scales: {
                x: {title: {display: true, text: "Week"}},
                y: {title: {display: true, text: "Score"}},
            },
        },
    });
}

function nextTrajectory() {
    if (!trajectories || trajectories.length === 0) {
        alert('No trajectories found. Please run the simulation first!');
        return;
    }
    currentIndex = (currentIndex + 1 + trajectories.length) % trajectories.length;
    const total = trajectories.length;
    if (currentIndex > total) {
        drawAllTrajectories()
    }
    else {
        drawSingleTrajectory(currentIndex);
        document.getElementById('trajectoryInfo').textContent = `Trajectory ${currentIndex + 1} of ${trajectories.length}`;
    }
}

function prevTrajectory() {
    if (!trajectories || trajectories.length === 0) {
        alert('No trajectories found. Please run the simulation first!');
        return;
    }
    currentIndex = (currentIndex - 1 + trajectories.length) % trajectories.length;
    const total = trajectories.length;
    if (currentIndex > total) {
        drawAllTrajectories()
    }
    else {
        drawSingleTrajectory(currentIndex);
        document.getElementById('trajectoryInfo').textContent = `Trajectory ${currentIndex + 1} of ${trajectories.length}`;
    }
}

function toggleAutoScroll() {
    if (!trajectories || trajectories.length === 0) {
        alert('No trajectories found. Please run the simulation first!');
        return;
    }
    const btn = document.getElementById('autoBtn');
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

function drawHistogram() {
    document.getElementById('histogramBlock').classList.add('visible');
    const ctx = document.getElementById('finalScoreChart').getContext('2d');
    if (histogramChart) {
        histogramChart.destroy()
    }
    if (!trajectories || trajectories.length === 0) {
        alert('No trajectories found. Please run the simulation first!');
        return;
    }
    const finalScores = trajectories.map(path => path[path.length - 1]);
    const counts = {}
    finalScores.forEach(score => {
        counts[score] = (counts[score] || 0) + 1;
    });
    const sortedScores = Object.keys(counts).map(k => parseInt(k)).sort((a, b) => a - b);
    const data = sortedScores.map(k => counts[k]);

    if (histogramChart) {
        histogramChart.destroy()
    }
    histogramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedScores,
            datasets: [{
                label: 'Score frequency',
                data: data,
                backgroundColor: 'steelblue',
                borderColor: 'navy',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Final Scores histogram'
                }
            }
        },
        scales: {
            x: {
                title: {display: true, text: "Score"}
            },
            y: {
                title: {display: true, text: "Frequency"},
                beginAtZero: true,
            }
        }
    });
}

function runSimulation() {
    p = parseFloat(document.getElementById("probability").value);
    attackers = parseInt(document.getElementById("attackers").value);
    weeks = parseInt(document.getElementById("weeks").value);

    if (!p || !attackers || !weeks) {
        alert("Please fill in all fields before running the simulation!");
        return;
    }

    trajectories = generateTrajectories(weeks, attackers, p);
    currentIndex = 0;

    document.getElementById('chartBlock').classList.add('visible');
    document.getElementById('histogramBlock').classList.remove('visible');
    document.getElementById('histogramBtn').classList.add('visible');

    drawSingleTrajectory(currentIndex);
    document.getElementById('trajectoryInfo').textContent = `Trajectory ${currentIndex + 1} of ${trajectories.length}`;
}
