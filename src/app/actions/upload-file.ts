'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { auth } from '@/auth'

export async function uploadFile(formData: FormData, folder: string = 'documents') {
    // Wrap EVERYTHING in try-catch to prevent 500s from crashing the client
    try {
        console.log("Upload Action Started");
        const session = await auth();
        console.log("Upload Auth Session:", session?.user?.id);

        if (!session?.user?.companyId) {
            console.error("Upload Unauthorized: No companyId");
            return { error: "Unauthorized" };
        }

        const file = formData.get('file') as File;
        if (!file) {
            return { error: "No file uploaded" };
        }

        console.log("Upload File Received:", file.name, file.type, file.size);

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

        // STRATEGY CHANGE: Use Base64 Data URI instead of File System
        // This is more robust for serverless/container environments like Render
        // where the filesystem might be ephemeral or read-only.

        const base64String = buffer.toString('base64');
        const mimeType = file.type;
        const dataUri = `data:${mimeType};base64,${base64String}`;

        console.log("Upload Success: Converted to Data URI");

        return {
            success: true,
            url: dataUri, // Return the Base64 string as the URL
            filename: originalName,
            size: file.size,
            type: file.type
        };

    } catch (error: any) {
        console.error("Upload Fatal Error:", error);
        return { error: `Upload failed: ${error.message}` };
    }
}
