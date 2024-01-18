// lightweight zod
export const $const = (def) => (input) => {
    return input === def;
};
// for compressor
const _typeof = (input) => typeof input;
export const $undefined = (input) => {
    return input === undefined;
};
export const $null = (input) => {
    return input === null;
};
export const $void = (input) => {
    return input == null;
};
export const $any = (input) => {
    return true;
};
export const $opt = (validator) => (input, ctx) => {
    return input == null || validator(input, ctx);
};
export const $nullable = (validator) => (input, ctx) => {
    return input === null || validator(input, ctx);
};
export const $string = (input) => {
    return _typeof(input) === "string";
};
/** Number parseable string for record key */
export const $numberString = (input) => {
    if (_typeof(input) === "string" && input.length > 0) {
        const parsed = Number(input);
        return Number.isNaN(parsed) === false;
    }
    return false;
};
export const $regexp = (regexp) => (input) => {
    return _typeof(input) === "string" && regexp.test(input);
};
export const $symbol = (input) => {
    return _typeof(input) === "symbol";
};
export const $number = (input) => {
    return _typeof(input) === "number";
};
export const $bigint = (input) => {
    return _typeof(input) === "bigint";
};
export const $numberRange = (min, max) => (input) => {
    return _typeof(input) === "number" && (min === undefined || input >= min) && (max === undefined || input < max);
};
export const $i8 = (input) => {
    return _typeof(input) === "number" && input % 1 === 0 && input >= -128 && input < 128;
};
export const $u8 = (input) => {
    return _typeof(input) === "number" && input % 1 === 0 && input >= 0 && input < 256;
};
export const $i16 = (input) => {
    return _typeof(input) === "number" && input % 1 === 0 && input >= -32768 && input < 32768;
};
export const $u16 = (input) => {
    return _typeof(input) === "number" && input % 1 === 0 && input >= 0 && input < 65536;
};
export const $i32 = (input) => {
    return _typeof(input) === "number" && input % 1 === 0 && input >= -2147483648 && input < 2147483648;
};
export const $u32 = (input) => {
    return _typeof(input) === "number" && input % 1 === 0 && input >= 0 && input < 4294967296;
};
export const $boolean = (input) => {
    return _typeof(input) === "boolean";
};
export const $enum = (enums) => (input) => {
    return enums.includes(input);
};
export const $intersection = (validators) => {
    return ((input, ctx = { errors: [] }, path = []) => {
        for (const validator of validators) {
            if (!validator(input, ctx, path))
                return false;
        }
        return true;
    });
};
export const $union = (validators) => (input, ctx, path = []) => {
    for (const validator of validators) {
        if (validator(input, ctx, path)) {
            return true;
        }
    }
    return false;
};
export const $object = (vmap, exact = true) => {
    const fn = (input, ctx, path = []) => {
        if (_typeof(input) !== "object" || input === null) {
            return false;
        }
        const unchecked = new Set(Object.keys(input));
        let failed = false;
        for (const [key, validator] of Object.entries(vmap)) {
            if (key === "__proto__") {
                continue;
            }
            const childPath = [...path, key];
            if (!validator(input?.[key], ctx, childPath)) {
                failed = true;
                ctx?.errors.push(childPath);
            }
            unchecked.delete(key);
        }
        if (failed)
            return false;
        if (exact) {
            return unchecked.size === 0;
        }
        else {
            return true;
        }
    };
    return fn;
};
export const $array = (child) => {
    const fn = (input, ctx, path = []) => {
        if (!Array.isArray(input))
            return false;
        let failed = false;
        for (let i = 0; i < input.length; i++) {
            const childPath = [...path, i];
            const v = input[i];
            if (!child(v, ctx, childPath)) {
                failed = true;
                ctx?.errors.push(childPath);
            }
        }
        if (failed)
            return false;
        return true;
    };
    return fn;
};
export const $record = (keyValidator, valueValidator) => {
    const fn = (input, ctx, path = []) => {
        if (_typeof(input) !== "object" || input === null) {
            return false;
        }
        let failed = false;
        for (const [key, val] of Object.entries(input)) {
            if (key === "__proto__")
                continue;
            const childPath = [...path, key];
            if (!keyValidator(key, ctx, childPath)) {
                failed = true;
                ctx?.errors.push(childPath);
            }
            if (!valueValidator(val, ctx, childPath)) {
                failed = true;
                ctx?.errors.push(childPath);
            }
        }
        if (failed)
            return false;
        return true;
    };
    return fn;
};
export const $tuple = (children) => {
    const fn = (input, ctx, path = []) => {
        if (!Array.isArray(input))
            return false;
        const length = Math.max(children.length, input.length ?? 0);
        let failed = false;
        for (let i = 0; i < length; i++) {
            const childPath = [...path, i];
            const v = input[i];
            if (!children[i]?.(v, ctx, childPath)) {
                failed = true;
                ctx?.errors.push(childPath);
            }
        }
        return !failed;
    };
    return fn;
};
export const access = (obj, path) => path.reduce((o, k) => o?.[k], obj);
