'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { auth } from '@/auth'

export async function uploadProductImage(formData: FormData) {
    const session = await auth();
    if (!session?.user?.companyId) {
        return { error: "Unauthorized" };
    }

    const file = formData.get('file') as File;
    if (!file) {
        return { error: "No file uploaded" };
    }

    if (!file.type.startsWith('image/')) {
        return { error: "File must be an image" };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return { error: "File size must be less than 5MB" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, ''); // Sanitize
    const filename = `product-${uniqueSuffix}-${originalName}`;

    // Ensure directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
    try {
        await mkdir(uploadDir, { recursive: true });

        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return public URL
        const url = `/uploads/products/${filename}`;
        return { success: true, url };

    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to save file" };
    }
}
