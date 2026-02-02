'use server'

import { prisma } from "@/lib/prisma"
import { currenciesList, countriesList, modulesList } from "@/lib/static-data"

export async function getCountries() {
    try {
        const count = await prisma.countries.count();
        if (count === 0) {
            console.log("Auto-seeding Countries...");
            await prisma.countries.createMany({
                data: countriesList.map(c => ({
                    iso2: c.iso2,
                    iso3: c.iso3,
                    name: c.name,
                    flag: c.flag,
                    region: c.region,
                    is_active: true
                })),
                skipDuplicates: true
            });
        }

        const countries = await prisma.countries.findMany({
            where: { is_active: true },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, iso2: true }
        });
        return countries;
    } catch (error) {
        console.error("Failed to fetch countries:", error);
        return [];
    }
}

export async function getCurrencies() {
    try {
        const count = await prisma.currencies.count();
        if (count === 0) {
            console.log("Auto-seeding Currencies...");
            await prisma.currencies.createMany({
                data: currenciesList.map(c => ({
                    code: c.code,
                    name: c.name,
                    symbol: c.symbol,
                    is_active: true
                })),
                skipDuplicates: true
            });
        }

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
        const count = await prisma.modules.count();
        if (count === 0) {
            console.log("Auto-seeding Modules...");
            await prisma.modules.createMany({
                data: modulesList.map(m => ({
                    module_key: m.key,
                    name: m.name,
                    description: m.desc,
                    is_active: true
                })),
                skipDuplicates: true
            });
        }

        const modules = await prisma.modules.findMany({
            where: {
                is_active: true,
                module_key: { notIn: ['system'] }
            },
            orderBy: { name: 'asc' },
            select: { id: true, module_key: true, name: true, description: true }
        });
        return modules;
    } catch (error) {
        console.error("Failed to fetch modules:", error);
        return [];
    }
}
