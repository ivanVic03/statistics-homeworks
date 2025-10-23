let originalChart = null
let encryptedChart = null

function letterFrequency(text) {
    const freq = {};
    const cleanText = text.toLowerCase().replace(/[^a-z]/g, '');
    const total = cleanText.length;

    for (let i = 97; i <= 122; i++) {
        freq[String.fromCharCode(i)] = 0;
    }

    for (let c of cleanText) {
        freq[c]++;
    }

    if (total === 0) {
        return { labels: [], values: [] };
    }

    const labels = Object.keys(freq);
    const values = labels.map(l => parseFloat((100 * freq[l] / total).toFixed(2)));

    return { labels, values };
}


function CaesarCipher(str, shift){
    return str.replace(/[a-z]/gi, c => {
        const base = c === c.toUpperCase()? 65: 97;
        return String.fromCharCode((c.charCodeAt(0) - base + shift + 26) % 26 + base);
    })
}

function drawChart(canvasId, freqData, label, existingChart) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        return null;
    }
    const ctx = canvas.getContext('2d');

    if (existingChart instanceof Chart) {
        existingChart.destroy();
    }

    if (!freqData || !freqData.labels || !freqData.labels.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return null;
    }

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: freqData.labels,
            datasets: [{
                label: label,
                data: freqData.values,
                backgroundColor: 'blue',
                borderColor: 'blue',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'black',
                        font: {size: 14}
                    }
                },
                title: {
                    display: true,
                    text: label,
                    color: 'black',
                    font: {size: 16, weight: 'bold'}
                }
            },
            scales: {
                x: {
                    ticks: {color: 'red'},
                    grid: {color: 'black'},
                    title: {display: true, text: 'Letters', color: 'red'}
                },
                y: {
                    beginAtZero: true,
                    ticks: {color: 'red'},
                    grid: {color: 'black'},
                    title: {display: true, text: 'Frequency (%)', color: 'red'}
                }
            }
        }
    })
}

let freqOriginal = null;

function encrypt() {
    const text = document.getElementById("originalText").value.trim();
    const shift = parseInt(document.getElementById("shift").value) || 0;
    if (!text || shift === 0) {
        alert("Please enter text and a valid shift (1-25).");
        return;
    }
    const encrypted = CaesarCipher(text, shift);
    const freqEncrypted = letterFrequency(encrypted);
    freqOriginal = letterFrequency(text);
    document.getElementById("outputText").value = encrypted;
    originalChart = drawChart("originalChart", freqOriginal, "[Encryption] Original", originalChart);
    encryptedChart = drawChart("encryptedChart", freqEncrypted, "[Encryption] Encrypted", encryptedChart);
}

function guessShift(encryptedText, freqOriginal) {
    if (!freqOriginal || !Array.isArray(freqOriginal.values) || freqOriginal.values.length === 0) {
        throw new Error("The original frequency is not valid! Please fix this!")
    }
    let bestShift = 0;
    let minDiff = Infinity;
    let relatedFrequency = null;

    for (let shift = 0; shift < 26; shift++) {
        const candidate = CaesarCipher(encryptedText, -shift);
        const testFreq = letterFrequency(candidate);

        if (!testFreq || !Array.isArray(testFreq.values) || testFreq.values.length === 0) {
            continue;
        }

        let diff = 0;
        for (let i = 0; i < 26; i++) {
            const refVal = Number(freqOriginal.values[i]) || 0;
            const testVal = Number(testFreq.values[i]) || 0;
            diff += Math.abs(refVal- testVal);
        }

        diff = diff / 26;
        if (minDiff < minDiff) {
            minDiff = diff;
            bestShift = shift;
            relatedFrequency = testFreq
        }

        return {shift: bestShift, score: minDiff, frequency: relatedFrequency};
    }
}

function decrypt() {
    const encryptedText = document.getElementById("outputText").value;
    console.log(encryptedText);
    const result = guessShift(encryptedText, freqOriginal);
    const guessedShift = result.shift;
    const decrypted = CaesarCipher(encryptedText, -guessedShift);
    document.getElementById("originalText").value = decrypted;
    const guessedFrequency = result.frequency;
    drawChart("originalChart", freqOriginal, "Result of the decryption", originalChart);
    drawChart("encryptedChart", guessedFrequency, "Encrypted text", encryptedChart);
}



