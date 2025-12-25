
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Load .env manually
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        for (const line of envConfig.split('\n')) {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim().replace(/"/g, '');
            }
        }
    }
} catch (e) {
    console.log('Could not load .env', e);
}

const prisma = new PrismaClient();

async function addMenu() {
    try {
        // 1. Find 'Settings' parent menu
        const settingsMenu = await prisma.menu_items.findFirst({
            where: {
                OR: [
                    { label: { contains: 'Settings', mode: 'insensitive' } },
                    { path: '/settings' }
                ]
            }
        });

        if (!settingsMenu) {
            console.log("Could not find 'Settings' menu to attach to.");
            return;
        }

        console.log(`Found Parent Menu: ${settingsMenu.label} (${settingsMenu.id})`);

        // 2. Check if 'Accounting' exists under settings
        const existing = await prisma.menu_items.findFirst({
            where: { path: '/settings/accounting' }
        });

        if (existing) {
            console.log("Menu already exists:", existing.id);
            return;
        }

        // 3. Create 'Accounting' menu item
        // We need to find `module_key` or `permission`?
        // Based on navigation.ts, we don't strictly *need* permission_code if open.
        // We'll mimic the parent's module or default to 'general'.

        // Find next sort order
        const lastChild = await prisma.menu_items.findFirst({
            where: { parent_id: settingsMenu.id },
            orderBy: { sort_order: 'desc' }
        });
        const sortOrder = (lastChild?.sort_order || 0) + 10;

        const newMenu = await prisma.menu_items.create({
            data: {
                label: 'Accounting',
                path: '/settings/accounting',
                icon: 'Calculator', // Assuming Lucide icon name or similar
                parent_id: settingsMenu.id,
                sort_order: sortOrder,
                is_active: true
            }
        });

        console.log("Created 'Accounting' menu item:", newMenu.id);

    } catch (e) {
        console.error('Error adding menu:', e);
    } finally {
        await prisma.$disconnect();
    }
}

addMenu();
