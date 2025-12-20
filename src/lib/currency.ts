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

/**
 * Get company's default currency from settings
 * 
 * Priority:
 * 1. Company accounting settings (currency_id)
 * 2. Company's country default currency
 * 3. Fallback to USD
 */
export async function getCompanyDefaultCurrency(companyId?: string): Promise<string> {
    'use server'

    try {
        const tenantId = await getCurrentTenantId()

        // Get company with accounting settings and country
        const company = await prisma.company.findFirst({
            where: {
                tenant_id: tenantId,
                ...(companyId ? { id: companyId } : {}),
            },
            include: {
                company_settings: {
                    include: {
                        company_accounting_settings: {
                            include: {
                                currencies: true
                            }
                        }
                    }
                },
                countries: {
                    select: {
                        iso2: true,
                    }
                }
            }
        })

        if (!company) {
            return 'USD'
        }

        // Priority 1: Check company accounting settings currency
        const currencyCode = company.company_settings?.company_accounting_settings?.currencies?.code
        if (currencyCode) {
            return currencyCode
        }

        // Priority 2: Check country's default currency
        const countryCode = company.countries?.iso2?.toUpperCase()
        if (countryCode && CURRENCY_CODES[countryCode]) {
            return CURRENCY_CODES[countryCode]
        }

        // Fallback to USD
        return 'USD'

    } catch (error) {
        console.error('Error fetching company default currency:', error)
        return 'USD'
    }
}
