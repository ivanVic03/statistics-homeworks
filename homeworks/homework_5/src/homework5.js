function clearField(fieldId, outputId) {
    const fld = document.getElementById(fieldId);
    const out = document.getElementById(outputId);
    if (fld) fld.value = '';
    if (out) out.value = '';
    fld.focus();
}

function calcArithmetic() {
    const raw = document.getElementById('arith-input').value;
    const vals = raw.split(/[,\\s]+/).map(s => Number(s.trim())).filter(x => !Number.isNaN(x));
    const out = document.getElementById('arith-output');

    if (vals.length === 0) {
        out.value = "⚠️ Please enter at least one valid number.";
        return;
    }

    const sum = vals.reduce((a,b) => a + b, 0);
    const mean = (sum / vals.length).toFixed(3);

    out.value =
        `Values: ${vals.join(', ')}\n` +
        `Sum = ${sum}\n` +
        `n = ${vals.length}\n` +
        `Arithmetic Mean = ${mean}`;
}


function calcGeometric() {
    const raw = document.getElementById('geom-input').value;
    const vals = raw.split(/[,\\s]+/).map(s => Number(s.trim())).filter(x => x > 0);
    const out = document.getElementById('geom-output');

    if (vals.length === 0) {
        out.value = "Enter at least one positive number.";
        return;
    }

    const logSum = vals.reduce((s,v) => s + Math.log(v), 0);
    const gm = Math.exp(logSum / vals.length).toFixed(3);

    out.value =
        `Multipliers: ${vals.join(', ')}\n` +
        `Geometric Mean = ${gm}`;
}

function calcWeighted() {
    const raw = document.getElementById('weighted-input').value;
    const out = document.getElementById('weighted-output');

    if (!raw) {
        out.value = "Enter value:weight pairs (e.g. 10:100,40:50).";
        return;
    }

    const pairs = raw.split(/[,;\\n]+/).map(s => s.trim()).filter(Boolean);
    const parsed = [];

    pairs.forEach(p => {
        const parts = p.split(':').map(s => s.trim());
        if (parts.length === 2) {
            const val = Number(parts[0]), w = Number(parts[1]);
            if (Number.isFinite(val) && Number.isFinite(w)) parsed.push({ val, w });
        }
    });

    if (parsed.length === 0) {
        out.value = "Unrecognized format. Use value:weight pairs, e.g. 10:100,40:50.";
        return;
    }

    const weightedSum = parsed.reduce((s,p) => s + p.val * p.w, 0);
    const weights = parsed.reduce((s,p) => s + p.w, 0);

    if (weights === 0) {
        out.value = "Sum of weights must be non-zero.";
        return;
    }

    const wm = (weightedSum / weights).toFixed(3);

    out.value =
        `Pairs: ${parsed.map(p => p.val + ':' + p.w).join(', ')}\n` +
        `Weighted sum = ${weightedSum}\n` +
        `Sum of weights = ${weights}\n` +
        `Weighted Mean = ${wm}`;
}

function calcHarmonic() {
    const raw = document.getElementById('harm-input').value;
    const vals = raw.split(/[,\\s]+/).map(s => Number(s.trim())).filter(x => x > 0);
    const out = document.getElementById('harm-output');

    if (vals.length === 0) {
        out.value = "Please enter positive numbers (no zeros allowed).";
        return;
    }

    const denom = vals.reduce((s, v) => s + 1/v, 0);
    const hm = (vals.length / denom).toFixed(3);

    out.value =
        `Values: ${vals.join(', ')}\n` +
        `n = ${vals.length}\n` +
        `Sum of reciprocals = ${denom.toFixed(3)}\n` +
        `Harmonic Mean = ${hm}`;
}

function calcQuadratic() {
    const raw = document.getElementById('quad-input').value;
    const vals = raw.split(/[,\\s]+/).map(s => Number(s.trim())).filter(x => Number.isFinite(x));
    const out = document.getElementById('quad-output');

    if (vals.length === 0) {
        out.value = "Please enter valid numeric values.";
        return;
    }

    const sqSum = vals.reduce((s, v) => s + v * v, 0);
    const rms = Math.sqrt(sqSum / vals.length).toFixed(3);

    out.value =
        `Values: ${vals.join(', ')}\n` +
        `Sum of squares = ${sqSum.toFixed(3)}\n` +
        `n = ${vals.length}\n` +
        `Quadratic Mean (RMS) = ${rms}`;
}

function calcMedian() {
    let input = document.getElementById("median-input").value.trim();
    if (!input) return;
    let values = input.split(",").map(Number).sort((a, b) => a - b);
    let n = values.length;
    let median = (n % 2 === 0)
        ? (values[n / 2 - 1] + values[n / 2]) / 2
        : values[(n - 1) / 2];
    document.getElementById("median-output").value = `Median = ${median.toFixed(3)}`;
}

function calcMode() {
    let input = document.getElementById("mode-input").value.trim();
    if (!input) return;
    let values = input.split(",").map(Number);
    let freq = {};
    values.forEach(v => freq[v] = (freq[v] || 0) + 1);
    let maxFreq = Math.max(...Object.values(freq));
    let modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
    document.getElementById("mode-output").value =
        (modes.length > 1)
            ? `Multimodal: ${modes.join(", ")}`
            : `Mode = ${modes[0]}`;
}

function calcStdDev() {
    let input = document.getElementById("stddev-input").value.trim();
    if (!input) return;
    let values = input.split(",").map(Number);
    let n = values.length;
    let mean = values.reduce((a, b) => a + b, 0) / n;
    let variance = values.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n;
    let stddev = Math.sqrt(variance);
    document.getElementById("stddev-output").value = `s = ${stddev.toFixed(3)}`;
}

function calcIQR() {
    let input = document.getElementById("iqr-input").value.trim();
    if (!input) return;
    let values = input.split(",").map(Number).sort((a, b) => a - b);
    let n = values.length;
    let q1 = medianOf(values.slice(0, Math.floor(n / 2)));
    let q3 = medianOf(values.slice(Math.ceil(n / 2)));
    let iqr = q3 - q1;
    document.getElementById("iqr-output").value =
        `Q1 = ${q1.toFixed(3)}, Q3 = ${q3.toFixed(3)}, IQR = ${iqr.toFixed(3)}`;
}

function medianOf(arr) {
    let n = arr.length;
    return (n % 2 === 0)
        ? (arr[n / 2 - 1] + arr[n / 2]) / 2
        : arr[(n - 1) / 2];
}



window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input, textarea').forEach(el => {
        el.value='';
    })
})

function showTheory() {
    window.location.href = "theory.html";
}

function showPractice() {
    window.location.href = "simulate-mean-calculations.html";
}
