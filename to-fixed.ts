export default function toFixed(value: unknown, fractionDigits = 2) {
    const valueStr = `${value ?? ""}`;
    let num = Number(valueStr);
    if (isNaN(num)) return 0;
    let temp = num.toFixed(fractionDigits);
    return Number(temp);
}