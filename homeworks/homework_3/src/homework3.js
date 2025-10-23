let freqOriginal = null;
let originalChart = null;
let encryptedChart = null;

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

function gcd(a,b) {
    let r = a % b;
    while (r !== 0) {
        a = b;
        b = r;
        r = a % b;
    }
    return b;
}

