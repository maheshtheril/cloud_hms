// Currency formatting utilities
// Maps country codes to their currency symbols and formats

export const CURRENCY_SYMBOLS: Record<string, string> = {
    'IN': '₹',   // India - Rupee
    'US': '$',   // United States - Dollar
    'GB': '£',   // United Kingdom - Pound
    'EU': '€',   // European Union - Euro
    'AE': 'AED', // UAE - Dirham
    'SA': 'SAR', // Saudi Arabia - Riyal
    'AU': 'A$',  // Australia - Dollar
    'CA': 'C$',  // Canada - Dollar
    'SG': 'S$',  // Singapore - Dollar
};

export const CURRENCY_CODES: Record<string, string> = {
    'IN': 'INR',
    'US': 'USD',
    'GB': 'GBP',
    'EU': 'EUR',
    'AE': 'AED',
    'SA': 'SAR',
    'AU': 'AUD',
    'CA': 'CAD',
    'SG': 'SGD',
};

/**
 * Get currency symbol based on country code
 */
export function getCurrencySymbol(countryCode: string): string {
    return CURRENCY_SYMBOLS[countryCode?.toUpperCase()] || '$';
}

/**
 * Get currency code based on country code
 */
export function getCurrencyCode(countryCode: string): string {
    return CURRENCY_CODES[countryCode?.toUpperCase()] || 'USD';
}

/**
 * Format amount with currency symbol
 */
export function formatCurrency(amount: number, countryCode: string): string {
    const symbol = getCurrencySymbol(countryCode);
    const formatted = amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // For symbols like ₹, £, put before number
    // For codes like AED, SAR, put after number
    if (symbol.length === 1) {
        return `${symbol}${formatted}`;
    } else {
        return `${formatted} ${symbol}`;
    }
}

/**
 * Format amount for Indian market specifically
 */
export function formatINR(amount: number): string {
    return `₹${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}
