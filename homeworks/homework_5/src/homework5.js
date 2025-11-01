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
