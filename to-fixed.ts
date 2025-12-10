/**
 * 
 * @param value 
 * @param fractionDigits
 * @example
 * toFixed(2.1234,2)// 2.12
 * toFixed(2.1234)// 2.12
 * toFixed(2.123)// 2.12
 * toFixed(2.1)// 2.1
 * toFixed(2)// 2 
 * @returns 
 */
export function toFixed(value: unknown, fractionDigits = 2) {
    const valueStr = `${value ?? ""}`;
    let num = Number(valueStr);
    if (isNaN(num)) return 0;
    let temp = num.toFixed(fractionDigits);
    return Number(temp);
}