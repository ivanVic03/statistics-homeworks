let originalChart = null
let encryptedChart = null

function letterFrequency(text) {
    const freq = {}
    const cleanText = text.toLowerCase().replace(/[^a-z]/g, '');
    for (let c of cleanText) {
        freq[c] = (freq[c] || 0) + 1;
    }
    const total = cleanText.length;
    if (total === 0) {
        return "no letters found";
    }
    return Object.entries(freq).sort().map(([ch,count]) => `${ch}: ${(100 * count / total).toFixed(2)}%`).join('\n');
}

function CaesarCipher(str, shift){
    return str.replace(/[a-z]/gi, c => {
        const base = c === c.toUpperCase()? 65: 97;
        return String.fromCharCode((c.charCodeAt(0) - base + shift + 26) % 26 + base);
    })
}

function drawChart(canvasId, data, label, existingChart) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    if (existingChart) {
        existingChart.destroy()
        existingChart = null;
    }
    return new Chart (ctx, {
        type: 'bar',
        data: {
            labels: [... 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
            datasets: [{
                label: label,
                data: data,
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {display: true, text: 'Frequency'}
                }
            }
        }
    });
}

function encrypt() {
    const text = document.getElementById("originalText").value;
    const shift = document.getElementById("shift").value;
    const encrypted = CaesarCipher(text, shift);
    const freqEncrypted = letterFrequency(encrypted);
    const freqOriginal = letterFrequency(text);
    document.getElementById("outpuText").value = encrypted;
    drawChart(document.getElementById("originalChart"), freqOriginal, "[Encryption] Original", originalChart);
    drawChart(document.getElementById("encryptedChart"), freqEncrypted, "[Encryption] Encrypted", encryptedChart);
}

function decrypt() {
    const text = document.getElementById("outputText").value;
    const shift = document.getElementById("shift").value;
    const decrypted = CaesarCipher(text, -shift);
    const freqOriginal = letterFrequency(text);
    const freqDecrypted = letterFrequency(decrypted);
    document.getElementById("originalText").value = decrypted;
    drawChart(document.getElementById("encryptedChart"), freqOriginal, "[Decryption] Original", originalChart);
    drawChart(document.getElementById("originalChart"), freqDecrypted, "[Decryption] Decrypted", encryptedChart);
}

