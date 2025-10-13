export function letterFrequency(text) {
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

export function CaesarCipher(str, shift){
    return str.replace(/[a-z]/gi, c => {
        const base = c === c.toUpperCase()? 65: 97;
        return String.fromCharCode((c.charCodeAt(0) - base + shift + 26) % 26) + base;
    })
}

export function encryptText() {
    const input = document.getElementById('originalText');
    const shift = parseInt(document.getElementById('shift').value);

    const encrypted = CaesarCipher(input, shift);
    document.getElementById('encryptedText').value = encrypted;

    const freqIn = letterFrequency(input);
    const freqOut = letterFrequency(encrypted);

    document.getElementById('freqOriginal').textContent = freqIn;
    document.getElementById('freqEncrypted').textContent = freqOut;
}
