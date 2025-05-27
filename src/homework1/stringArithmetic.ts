function trimZeros(str: string) {
    return str.replace(/^0+/, '') || '0';
}

function compareStrings(a: string, b: string) {
    a = trimZeros(a);
    b = trimZeros(b);
    if (a.length !== b.length) return a.length > b.length ? 1 : -1;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
    }
    return 0;
}

String.prototype.plus = function (other: string) {
    const length = Math.max(this.length, other.length);

    let a: string = this.padStart(length, '0');
    let b: string = other.padStart(length, '0');

    let result: string = '';
    let carry: number = 0;

    for (let i = length - 1; i >= 0; i--) {
        let sum = parseInt(a[i]) + parseInt(b[i]) + carry;

        result = (sum % 10) + result;

        carry = Math.floor(sum / 10);
    }

    if (carry) {
        result = carry + result;
    }
    return trimZeros(result);
}

String.prototype.minus = function (other: string) {
    if (compareStrings(this.toString(), other) < 0) throw new Error('Negative result not supported');

    const length = Math.max(this.length, other.length);

    let a: string = this.padStart(length, '0');
    let b: string = other.padStart(length, '0');

    let result: string = '';
    let borrow: number = 0;

    for (let i = length - 1; i >= 0; i--) {
        let difference = parseInt(a[i]) - parseInt(b[i]) - borrow;

        if (difference < 0) {
            difference += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }
        result = difference + result;
    }
    return trimZeros(result);
}

String.prototype.multiply = function (other: string) {

    let a = this;
    let b = other;

    let result = Array(a.length + b.length).fill(0);

    for (let i = a.length - 1; i >= 0; i--) {

        for (let j = b.length - 1; j >= 0; j--) {
            const pos1 = i + j, pos2 = i + j + 1;

            const mul = parseInt(a[i]) * parseInt(b[j]);
            const sum = mul + result[pos2];

            result[pos2] = sum % 10;
            result[pos1] += Math.floor(sum / 10);
        }
    }
    return trimZeros(result.join(''));
}

String.prototype.divide = function (other: string) {
    if (other === '0') throw new Error('Division by zero');

    let dividend = trimZeros(this.toString());
    const divisor = trimZeros(other);
    if (compareStrings(dividend, divisor) < 0) return '0';

    let result = '';
    let remainder = '';

    for (let i = 0; i < dividend.length; i++) {
        remainder += dividend[i];
        remainder = trimZeros(remainder);
        let count = 0;
        while (compareStrings(remainder, divisor) >= 0) {
            remainder = String.prototype.minus.call(remainder, divisor);
            count++;
        }
        result += count;
    }
    return trimZeros(result);
}


console.log('123'.plus('321'));
console.log('705'.minus('596'));
console.log('28'.multiply('341'))
console.log('2855'.divide('5'))

