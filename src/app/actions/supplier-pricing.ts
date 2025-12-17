'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function updateSupplierPricingDefaults(
    supplierId: string,
    defaults: {
        strategy: 'mrp_discount' | 'cost_markup' | 'none';
        percentage: number;
    }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: 'Unauthorized' };
        }

        // Update supplier metadata
        const updated = await prisma.hms_supplier.update({
            where: { id: supplierId },
            data: {
                metadata: {
                    pricing_defaults: defaults
                }
            }
        });

        return { success: true, data: updated };
    } catch (error) {
        console.error('Error updating supplier pricing defaults:', error);
        return { error: 'Failed to update pricing defaults' };
    }
}

export async function getSupplierPricingDefaults(supplierId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: 'Unauthorized' };
        }

        const supplier = await prisma.hms_supplier.findUnique({
            where: { id: supplierId },
            select: {
                id: true,
                name: true,
                metadata: true
            }
        });

        if (!supplier) {
            return { error: 'Supplier not found' };
        }

        const defaults = (supplier.metadata as any)?.pricing_defaults;

        return {
            success: true,
            data: defaults || { strategy: 'none', percentage: 0 }
        };
    } catch (error) {
        console.error('Error fetching supplier pricing defaults:', error);
        return { error: 'Failed to fetch pricing defaults' };
    }
}
