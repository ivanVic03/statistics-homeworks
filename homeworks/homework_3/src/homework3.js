let originalChart = null;
let encryptedChart = null;

//Encryption function

function modPow(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result*base) % modulus
            exponent = Math.floor(exponent/2);
            base = (base*base) % modulus;
        }
    }
    return result;
}

function lettersToNumber(pair) {
    const a = pair.charCodeAt(0) - 97;
    const b = pair.charCodeAt(1) - 97;
    return a*26 + b;
}

function numberToLetters(number) {
    const a = Math.floor(number / 26);
    const b = number % 26;
    return String.fromCharCode(a+97) + String.fromCharCode(b+97);
}

function rsaEncrypt(text) {
    const p = parseInt(document.getElementById("p").value) || 0;
    const q = parseInt(document.getElementById("q").value) || 0;
    if (p === 0 || q === 0) {
        alert("Please enter valid numbers for p and/or q")
    }
    const {n, e} = calculateRSAKeys(p, q);

    if (text.length % 2 === 1) {
        text += 'x'
    }
    let encrypted = [];
    for (let i = 0; i < text.length; i += 2) {
        const pair = text.slice(i, i + 2);
        const m = lettersToNumber(pair);
        const c = modPow(m, e, n)
        encrypted.push(c);
    }
    return encrypted;
}

function rsaDecrypt(encryptedArray) {
    const p = parseInt(document.getElementById("p").value);
    const q = parseInt(document.getElementById("q").value);
    if (p === 0 || q === 0) {
        alert("Please enter valid numbers for p and/or q")
    }
    const {n, d} = calculateRSAKeys(p, q);

    let decrypted = '';
    for (let c of encryptedArray) {
        const m = modPow(c, d, n);
        decrypted += numberToLetters(m);
    }
    return decrypted;
}

//RSA support functions

function gcd(a,b) {
    let r = a % b;
    while (r !== 0) {
        a = b;
        b = r;
        r = a % b;
    }
    return b;
}

function isPrime(number) {
    if (number < 2) {
        return false;
    }
    for (let i = 2; i < Math.sqrt(number); i++) {
        if (number % i === 0) {
            return false;
        }
    }
    return true;
}

function findE(phi) {
    if (!Number.isInteger(phi) || phi <= 1) {
        throw new RangeError("Invalid number" + phi);
    }

    let e = 2;
    while(e < phi) {
        if (isPrime(e) && gcd(e,phi) === 1) {
            return e;
        }
        e++;
    }
    throw new Error("No valid e found for phi: "+ phi );
}

function modInverse(e, phi) {
    let [a, m] = [e, phi]
    let [x, y] = [0, 1];
    while (a > 1) {
        let q = Math.floor(a/m);
        [a, m] = [m, a % m];
        [x, y] = [y-q*x, x];
    }
    if (y < 0) {
        y += phi;
    }
    return y;
}

function calculateRSAKeys(p, q) {
    if (!Number.isInteger(p) || !Number.isInteger(q) || q <= 1 || p <= 1) {
        throw new RangeError("Please set p and q greater than 1." );
    }
    const n = p*q;
    const phi = (p-1)*(q-1)
    const e = findE(phi);
    const d = modInverse(e, phi);
    return {n, phi, e, d}
}

//frequency analysis

function letterFrequency(text) {
    const freq = {}
    const cleanText = text.toLowerCase().replace(/[^a-z]/g, '')
    const total = cleanText.length
    for (let i = 97; i <= 122; i++) {
        freq[String.fromCharCode(i)] = 0;
    }
    for (let c of cleanText) {
        freq[c]++;
    }
    const labels = Object.keys(freq)
    const values = labels.map(label => parseFloat((100*freq[label]/total).toFixed(2)));
    return {labels, values};
}

function drawChart(canvasId, freqData, label, existingChart) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        return null;
    }
    const ctx = canvas.getContext('2d');
    if (existingChart instanceof Chart) {
        existingChart.destroy()
    }

    if (!freqData || !freqData.labels || freqData.labels.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return null;
    }

    return new Chart (ctx, {
        type: 'bar',
        data: {
            labels: freqData.labels,
            datasets: [{
                label: label,
                data: freqData.values,
                backgroundColor: 'blue',
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            }]
        }
    });
}

//buttons' functions
function encryptRSA() {
    const text = document.getElementById('originalText').value.trim().toLowerCase();
    if (!text) {
        return alert('Please enter a valid text');
    }
    const encryptedArray = rsaEncrypt(text);
    document.getElementById("outputText").value = encryptedArray.join(",");
    const freqOriginal = letterFrequency(text);
    originalChart = drawChart("originalChart", freqOriginal, "[RSA Encryption] Original", originalChart);
    encryptedChart = drawChart("encryptedChart", freqOriginal, "[RSA Encryption] Encrypted", encryptedChart);
}

function decryptRSA() {
    const encryptedText = document.getElementById('outputText').value.trim().toLowerCase();
    if (!encryptedText) {
        return null;
    }
    const encryptedArray = encryptedText.split(",").map(Number);
    const decrypted = rsaDecrypt(encryptedArray);
    document.getElementById("originalText").value = decrypted;
    const freqDecrypted = letterFrequency(decrypted);
    originalChart = drawChart("originalChart", freqDecrypted, "[RSA Decryption] Decrypted text", originalChart);
    encryptedChart = drawChart("encryptedChart", freqDecrypted, "[RSA Decryption] Encrypted text", encryptedChart);
}
