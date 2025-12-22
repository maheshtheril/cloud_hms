// Currency formatting utilities
// Maps country codes to their currency symbols and formats

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'


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
 * @param amount Number to format
 * @param currencyOrCountry Code (e.g. 'INR', 'USD', 'IN', 'US')
 */
export function formatCurrency(amount: number, currencyOrCountry: string = 'USD'): string {
    let symbol = '$';
    const code = currencyOrCountry?.toUpperCase();

    if (code === 'INR' || code === 'IN') symbol = '₹';
    else if (code === 'USD' || code === 'US') symbol = '$';
    else if (code === 'GBP' || code === 'GB') symbol = '£';
    else if (code === 'EUR' || code === 'EU') symbol = '€';
    else if (code === 'AED' || code === 'AE') symbol = 'AED';
    else if (code === 'SAR' || code === 'SA') symbol = 'SAR';
    else if (code === 'AUD' || code === 'AU') symbol = 'A$';
    else if (code === 'CAD' || code === 'CA') symbol = 'C$';
    else symbol = CURRENCY_SYMBOLS[code] || '$';

    const formatted = amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    if (symbol.length === 1 || symbol === 'A$' || symbol === 'C$' || symbol === 'S$') {
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
