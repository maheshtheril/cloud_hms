export function isUUID(str: any): boolean {
    if (typeof str !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

export function safeNum(val: any): number {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    // Strip everything except digits, dots and minus sign (for currency handling)
    const cleaned = val.toString().replace(/[^0-9.-]/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
}
