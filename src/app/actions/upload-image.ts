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

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert to Base64 Data URI for serverless compatibility
        const base64String = buffer.toString('base64');
        const mimeType = file.type;
        const dataUri = `data:${mimeType};base64,${base64String}`;

        return { success: true, url: dataUri };

    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to process image" };
    }
}
