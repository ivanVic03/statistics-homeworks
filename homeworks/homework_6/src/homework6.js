let meanData = {count: 0, mean: 0};
let varData = {count: 0, mean: 0, M2: 0};

let meanChartCtx = document.getElementById('meanChart')?.getContext('2d');
let varChartCtx = document.getElementById('varChart')?.getContext('2d');

let meanChart = meanChartCtx ? new Chart(meanChartCtx, {
    type: 'line',
    data: {labels: [], datasets: [{label: 'Mean', data: [], borderColor: 'red', fill: false}]},
    options: {responsive: true, animation: false, scales: {x: {title:{display:true,text:'n'}}, y: {title:{display:true,text:'Mean'}}}}
}) : null;

let varChart = varChartCtx ? new Chart(varChartCtx, {
    type: 'line',
    data: {labels: [], datasets: [{label: 'Variance', data: [], borderColor: 'blue', fill: false}]},
    options: {responsive: true, animation: false, scales: {x: {title:{display:true,text:'n'}}, y: {title:{display:true,text:'Variance'}}}}
}) : null;

function addNumber(type) {
    if(type === 'mean') {
        const input = parseFloat(document.getElementById('meanInput').value);
        if(isNaN(input)) return;
        meanData.count += 1;
        meanData.mean += (input - meanData.mean) / meanData.count;
        document.getElementById('meanOutput').textContent = meanData.mean.toFixed(3);

        if(meanChart) {
            meanChart.data.labels.push(meanData.count);
            meanChart.data.datasets[0].data.push(meanData.mean.toFixed(3));
            meanChart.update();
        }
    } else if(type === 'variance') {
        const input = parseFloat(document.getElementById('varInput').value);
        if(isNaN(input)) return;
        varData.count += 1;
        let delta = input - varData.mean;
        varData.mean += delta / varData.count;
        varData.M2 += delta * (input - varData.mean);
        let variance = varData.M2 / varData.count;
        document.getElementById('varOutput').textContent = variance.toFixed(3);

        if(varChart) {
            varChart.data.labels.push(varData.count);
            varChart.data.datasets[0].data.push(variance.toFixed(3));
            varChart.update();
        }
    }
}

function resetData(type) {
    if(type === 'mean') {
        meanData = {count:0, mean:0};
        document.getElementById('meanOutput').textContent = 0;
        document.getElementById('meanInput').value = '';
        if(meanChart) {
            meanChart.data.labels = [];
            meanChart.data.datasets[0].data = [];
            meanChart.update();
        }
    } else if(type === 'variance') {
        varData = {count:0, mean:0, M2:0};
        document.getElementById('varOutput').textContent = 0;
        document.getElementById('varInput').value = '';
        if(varChart) {
            varChart.data.labels = [];
            varChart.data.datasets[0].data = [];
            varChart.update();
        }
    }
}

function showMean() {
    window.location.href="mean.html"
}

function showVariance() {
    window.location.href="variance.html"
}

function showLastDiscussion() {
    window.location.href="last-discussion.html"
}