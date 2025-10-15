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

function drawChart(ctx, data, label) {
    new Chart (ctx, {
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
            scales: {
                y: {beginAtZero: true},
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("analyzeBtn").addEventListener("click", () => {
        const text = document.getElementById("originalText").value;
        const shift = document.getElementById("shift").value;
        const encrypted = CaesarCipher(text, shift);
        const freqOriginal = letterFrequency(text);
        const freqEncrypted = letterFrequency(encrypted);

        drawChart(document.getElementById("originalChart"), freqOriginal, "Original")
        drawChart(document.getElementById("encryptedChart"), freqEncrypted, "Encrypted")
    })
});

