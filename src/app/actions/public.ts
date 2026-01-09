'use server'

import { prisma } from "@/lib/prisma"

export async function getCountries() {
    console.log("Fetching countries...");
    try {
        const countries = await prisma.countries.findMany({
            where: { is_active: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, iso2: true }
        });
        console.log(`Fetched ${countries.length} countries`);
        return countries;
    } catch (error) {
        console.error("Failed to fetch countries:", error);
        return [];
    }
}

export async function getCurrencies() {
    try {
        const currencies = await prisma.currencies.findMany({
            where: { is_active: true },
            orderBy: { code: 'asc' },
            select: { id: true, code: true, name: true, symbol: true }
        });
        return currencies;
    } catch (error) {
        console.error("Failed to fetch currencies:", error);
        return [];
    }
}

export async function getModules() {
    try {
        const modules = await prisma.modules.findMany({
            where: {
                is_active: true,
                module_key: { notIn: ['system'] } // System is mandatory/internal
            },
            orderBy: { name: 'asc' },
            select: { id: true, module_key: true, name: true, description: true }
        });
        return modules;
    } catch (error) {
        // Fallback if table is empty or error
        return [
            { module_key: 'hms', name: 'Health Management', description: 'Hospital & Clinic Management' },
            { module_key: 'crm', name: 'CRM', description: 'Customer Relationship Management' },
            { module_key: 'finance', name: 'Finance', description: 'Financial Accounting & Billing' },
            { module_key: 'inventory', name: 'Inventory', description: 'Stock & Warehouse Management' },
            { module_key: 'hr', name: 'HR', description: 'Human Resources & Payroll' },
        ];
    }
}
