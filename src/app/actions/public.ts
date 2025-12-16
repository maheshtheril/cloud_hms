'use server'

import { prisma } from "@/lib/prisma"

export async function getCountries() {
    console.log("Fetching countries...");
    try {
        const countries = await prisma.countries.findMany({
            // where: { is_active: true }, // Temporarily removed for debugging
            orderBy: { name: 'asc' },
            select: { id: true, name: true, iso2: true }
        });
        console.log(`Fetched ${countries.length} countries`);
        if (countries.length > 0) return countries;

        // Fallback
        return [
            { id: 'us-fallback', name: 'United States', iso2: 'US' },
            { id: 'in-fallback', name: 'India', iso2: 'IN' },
            { id: 'uk-fallback', name: 'United Kingdom', iso2: 'GB' },
            { id: 'au-fallback', name: 'Australia', iso2: 'AU' },
            { id: 'ca-fallback', name: 'Canada', iso2: 'CA' },
            { id: 'ae-fallback', name: 'United Arab Emirates', iso2: 'AE' },
        ];
    } catch (error) {
        console.error("Failed to fetch countries:", error);
        return [
            { id: 'us-fallback', name: 'United States', iso2: 'US' },
            { id: 'in-fallback', name: 'India', iso2: 'IN' },
        ];
    }
}

export async function getCurrencies() {
    try {
        const currencies = await prisma.currencies.findMany({
            where: { is_active: true },
            orderBy: { code: 'asc' },
            select: { id: true, code: true, name: true, symbol: true }
        });
        if (currencies.length > 0) return currencies;

        // Fallback
        return [
            { id: 'usd-fallback', code: 'USD', name: 'US Dollar', symbol: '$' },
            { id: 'inr-fallback', code: 'INR', name: 'Indian Rupee', symbol: '₹' },
            { id: 'gbp-fallback', code: 'GBP', name: 'British Pound', symbol: '£' },
            { id: 'eur-fallback', code: 'EUR', name: 'Euro', symbol: '€' },
            { id: 'aed-fallback', code: 'AED', name: 'UAE Dirham', symbol: 'dh' },
        ];
    } catch (error) {
        console.error("Failed to fetch currencies:", error);
        return [
            { id: 'usd-fallback', code: 'USD', name: 'US Dollar', symbol: '$' },
        ];
    }
}

export async function getModules() {
    try {
        const modules = await prisma.modules.findMany({
            where: { is_active: true },
            orderBy: { name: 'asc' },
            select: { id: true, module_key: true, name: true, description: true }
        });
        return modules;
    } catch (error) {
        // Fallback if table is empty or error
        return [
            { module_key: 'hms', name: 'Health Management', description: 'Hospital & Clinic Management' },
            { module_key: 'crm', name: 'CRM', description: 'Customer Relationship Management' },
            { module_key: 'accounting', name: 'Accounting', description: 'Financial Accounting' },
            { module_key: 'inventory', name: 'Inventory', description: 'Stock & Warehouse Management' },
            { module_key: 'manufacturing', name: 'Manufacturing', description: 'Production & BOM' },
        ];
    }
}
