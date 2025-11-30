let simulationChart = null;

function standardNormal() {
    let u1 = Math.random()
    let u2 = Math.random()
    let z = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2)
    return z;
}

function simulateBrownianMotion(T, n, sigma) {
    const dt = T/n;
    const y_array = []
    y_array.push(0)
    let Yt = 0;
    for (let i = 0; i < n; i++) {
        let Z = standardNormal()
        Yt = Yt + (sigma*Z*Math.sqrt(dt))
        y_array.push(Yt)
    }
    return y_array
}

function drawChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        alert("No canvas found.");
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        alert("No ctx found.");
    }
}