'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { auth } from '@/auth'

export async function uploadFile(formData: FormData, folder: string = 'documents') {
    const session = await auth();
    if (!session?.user?.companyId) {
        return { error: "Unauthorized" };
    }

    const file = formData.get('file') as File;
    if (!file) {
        return { error: "No file uploaded" };
    }

    // Validate file type (PDF or Image)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return { error: "Invalid file type. Only PDF, JPG, PNG, and WebP are allowed." };
    }

    // Validate size (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
        return { error: "File size must be less than 10MB" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, ''); // Sanitize
    const filename = `${uniqueSuffix}-${originalName}`;

    // Ensure directory exists
    // public/uploads/[folder]
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder);

    try {
        await mkdir(uploadDir, { recursive: true });

        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return public URL and metadata
        const url = `/uploads/${folder}/${filename}`;

        return {
            success: true,
            url,
            filename: originalName,
            size: file.size,
            type: file.type
        };

    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to save file" };
    }
}
