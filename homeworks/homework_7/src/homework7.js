let p = 0;
let attackers = 0;
let weeks = 0;
let trajectories = [];
let finalFreqs = [];
let trajectoryChart = null;
let histogramChart = null;
let currentIndex = 0;

let autoscroll = false;
let autoscrollInterval = null;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('p').value = '';
    document.getElementById('attackers').value = '';
    document.getElementById('weeks').value = '';
    trajectories = [];
    finalFreqs = [];
    currentIndex = 0;
    trajectoryChart = null;
    histogramChart = null;
    autoscroll = false;
    autoscrollInterval = null;
})

function weeklyStep(p, m) {
    const pWeek = 1 - Math.pow(1-p, m);
    return Math.random() < pWeek ? -1: +1;
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

function drawSingleTrajectory(path, index, total) {
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
                    label: `Trajectory ${index + 1} of ${total}`,
                    data: path,
                    fill: false,
                    borderColor: 'steelblue',
                    tension: 0.2,
                },
            ],
        },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    x: { title: {display: true, text: "Week"}},
                    y: { title: {display: true, text: "Score"}},
                },
            },
    });
}

function showTrajectoryCarousel() {
    const total = trajectories.length;
    drawSingleTrajectory(trajectories[currentIndex], currentIndex, total);

    const interval = setInterval(() => {
        currentIndex += 1;
        if (currentIndex >= total) {
            clearInterval(interval);
            drawAllTrajectories();
        }
        else {
            drawSingleTrajectory(trajectories[currentIndex], currentIndex, total);
        }
    }, 1500)
}

function drawAllTrajectories() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    if (trajectoryChart) {
        trajectoryChart.destroy()
    }

    const datasets = trajectories.map((path, i)=> ({
        label: `Trajectory ${i + 1}`,
        data: path,
        fill: false,
        borderColor: 'lightgray',
        tension: 0.1,
        borderWidth: 1,
    }));

    if (datasets[0]) {
        datasets[0].borderColor = "steelblue";
    }

    trajectoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: trajectories.length}, (_, i) => i),
            datasets,
        },
        options: {
            responsive: true,
            animation: false,
            plugins: {
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

function prevTrajectory() {

}

function runSimulation() {
    p = document.getElementById("p").value;
    attackers = document.getElementById("attackers").value;
    weeks = document.getElementById("weeks").value;

    trajectories = generateTrajectories(weeks, attackers, p);
    currentIndex = 0;

    showTrajectoryCarousel();
}