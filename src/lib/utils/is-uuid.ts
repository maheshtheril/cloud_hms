export function isUUID(str: any): boolean {
    if (typeof str !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export function safeNum(val: any): number {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
}
