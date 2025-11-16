let processChart = null;

window.addEventListener('DOMContentLoaded', () => {
    processChart = null;
    document.getElementById('subintervals').value = '';
    document.getElementById('trials').value = '';
    document.getElementById('probability').value = '';
    document.querySelector('.results').classList.remove('visible');
    document.querySelector('.chart-container').classList.remove('visible');
    document.getElementById('final-considerations-block').classList.remove('visible');
    const runBtn = document.getElementById('runButton');
    if (runBtn) {
        runBtn.addEventListener('click', runSimulation);
    }
    else {
        const computeBtn = document.getElementById('computeLambda');
        if (computeBtn) {
            computeBtn.addEventListener('click', runSimulation);
        }
    }
});

function simulateTrial(p) {
    if (Math.random() < p) {
        return 1;
    }
    else return 0;
}

function runSimulation() {
    console.log("Starting simulation...");

    const n = parseInt(document.getElementById('subintervals').value);
    const m = parseInt(document.getElementById('trials').value);
    const p = parseFloat(document.getElementById('probability').value);

    if (!n || !m || !p || n <= 0 || m <= 0 || p < 0 || p > 1) {
        alert("Please enter valid parameters: n > 0, m > 0, 0 <= p <= 1.");
        return;
    }

    const lambdaData = calculateLambda(n,m,p)
    const lambda = lambdaData.lambda

    const p_sub = lambda / n;

    const processPath = simulateCountingProcess(n, lambda);
    if (processPath.length === 0) {
        alert("Simulation failed, processPath is empty.");
        return;
    }

    const K_final = processPath[processPath.length - 1];

    document.querySelector('.results').classList.add('visible');
    document.querySelector('.chart-container').classList.add('visible');
    document.getElementById('final-considerations-block').classList.add('visible');

    document.getElementById('lambda_result').textContent = lambda.toFixed(5);
    document.getElementById('k_result').textContent = K_final.toString();

    document.getElementById('simulation-prob').textContent = p_sub.toFixed(3)

    drawCountingProcessChart(processPath, 'breachDistributionChart');
}

function calculateLambda(n, m, p) {
    let totalBreaches = 0;
    const allBreachCounts = [];

    for (let i = 0; i < m; i++) {
        let currentSimBreaches = 0;

        for (let j = 0; j < n; j++) {
            currentSimBreaches += simulateTrial(p);
        }

        allBreachCounts.push(currentSimBreaches);
        totalBreaches += currentSimBreaches;
    }

    const averageLambda = totalBreaches / m;

    return { lambda: averageLambda, counts: allBreachCounts };
}

function simulateCountingProcess(n, lambda) {
    const p_sub = lambda / n;

    if (p_sub > 1) {
        alert(`Warning: Calculated probability p_sub = ${p_sub.toFixed(4)} is > 1. ...`);
        return []
    }

    let eventCount = 0;
    const path = [0];

    for (let i = 0; i < n; i++) {
        eventCount += simulateTrial(p_sub);
        path.push(eventCount);
    }

    return path;
}

function drawCountingProcessChart(path, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    if (processChart) {
        processChart.destroy();
    }

    const n = path.length - 1;

    const labels = path.map((_, index) => {
        const time_value = (n === 0) ? 0 : (index / n);
        return time_value.toFixed(n <= 10 ? 1 : 4);
    });

    processChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cumulative Event Count (K)',
                data: path,
                borderColor: 'steelblue',
                backgroundColor: 'rgba(70, 130, 180, 0.1)',
                fill: true,
                borderWidth: 2,
                pointRadius: 0,
                stepped: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Time (in [0, 1] interval)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cumulative Events'
                    },
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            }
        }
    });
}