function addValues(a, b) {

    const handlers = {
        'number:number': () => a + b,
        'string:any': () => String(a) + String(b),
        'any:string': () => String(a) + String(b),
        'boolean:boolean': () => a || b,
        'number:null': () => a,
        'null:number': () => b,
        'null:null': () => 0,
        'bigint:bigint': () => a + b,
    };

    const key = `${typeof a}:${typeof b}`;
    const keyAlt1 = `${typeof a}:any`;
    const keyAlt2 = `any:${typeof b}`;

    const firstMatchingKey = [key, keyAlt1, keyAlt2].find(k => handlers[k]);

    if (firstMatchingKey) {
        return handlers[firstMatchingKey]();
    }

    throw new Error(`Cannot add values of types "${typeof a}" and "${typeof b}"`);
}

function stringifyValue(value) {
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
    }
    return String(value);
}

function invertBoolean(value) {
    if (typeof value !== 'boolean') {
        throw new Error('invertBoolean expects a boolean argument');
    }
    return !value;
}

function convertToNumber(value) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
            throw new Error(`Cannot convert string "${value}" to number`);
        }
        return parsed;
    }
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    if (value === null) {
        return 0;
    }
    if (value === undefined) {
        throw new Error('Cannot convert undefined to number');
    }
    throw new Error(`Cannot convert type "${typeof value}" to number`);
}

function coerceToType(value, type) {
    switch (type) {
        case 'string':
            return stringifyValue(value);
        case 'number':
            return convertToNumber(value);
        case 'boolean':
            return Boolean(value);
        case 'object':
            if (typeof value === 'object' && value !== null) {
                return value;
            }
            throw new Error(`Cannot coerce "${value}" to object`);
        case 'array':
            if (Array.isArray(value)) {
                return value;
            }
            return [value];
        default:
            throw new Error(`Unsupported target type "${type}"`);
    }
}

function isPrimitive(value) {
    return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

function safeToDate(value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        throw new Error(`Cannot convert "${value}" to valid Date`);
    }
    return date;
}

console.log(addValues(false, true));
console.log(stringifyValue({ name: 'Victoria' }));
console.log(invertBoolean(false));
console.log(convertToNumber('12'));
console.log(coerceToType(5, 'array'));

console.log(isPrimitive(()=>console.log(5)))
console.log(safeToDate('10.06.2025'));