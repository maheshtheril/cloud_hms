'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react'
import { uploadFile } from '@/app/actions/upload-file'

interface FileUploadProps {
    onUploadComplete: (url: string, fileData?: any) => void;
    folder?: string;
    label?: string;
    accept?: string;
    currentFileUrl?: string | null;
    disabled?: boolean;
}

export function FileUpload({
    onUploadComplete,
    folder = 'documents',
    label = "Upload Document",
    accept = "application/pdf,image/*",
    currentFileUrl,
    disabled = false
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 300;
                    const MAX_HEIGHT = 300;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG at 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            // For Images: Compress client-side and return Data URI directly
            // This avoids sending large payloads to the server or dealing with filesystem issues
            if (file.type.startsWith('image/')) {
                console.log("Client-side compressing image...");
                const dataUrl = await compressImage(file);
                setPreviewUrl(dataUrl);
                onUploadComplete(dataUrl);
                setIsUploading(false);
                return;
            }

            // Fallback for non-images (PDFs etc) - Use Server Action
            const formData = new FormData();
            formData.append('file', file);

            const res = await uploadFile(formData, folder);

            if (res.error) {
                setError(res.error);
                setPreviewUrl(null);
            } else if (res.url) {
                setPreviewUrl(res.url);
                onUploadComplete(res.url, res);
            }
        } catch (err) {
            setError("Upload failed. Please try again.");
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering click on parent
        setPreviewUrl(null);
        onUploadComplete("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="w-full space-y-2">
            <div
                className={`
                    relative group cursor-pointer
                    border-2 border-dashed rounded-xl p-6 transition-all duration-200
                    flex flex-col items-center justify-center text-center gap-3
                    ${isDragging
                        ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
                        : previewUrl
                            ? 'border-green-200 bg-green-50/30'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    }
                `}
                onDragEnter={disabled ? undefined : handleDrag}
                onDragLeave={disabled ? undefined : handleDrag}
                onDragOver={disabled ? undefined : handleDrag}
                onDrop={disabled ? undefined : handleDrop}
                onClick={disabled ? undefined : () => fileInputRef.current?.click()}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept={accept}
                />

                {isUploading ? (
                    <div className="py-4">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                        <p className="text-sm font-medium text-blue-600">Uploading...</p>
                    </div>
                ) : previewUrl ? (
                    <div className="flex items-center gap-4 w-full p-2">
                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                            {previewUrl.toLowerCase().endsWith('.pdf') ? (
                                <FileText className="h-6 w-6 text-green-600" />
                            ) : (
                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                            )}
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {previewUrl.split('/').pop()}
                            </p>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Upload Complete
                            </p>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <Upload className="h-6 w-6 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-700">
                                {label}
                            </p>
                            <p className="text-xs text-gray-500">
                                Drag & drop or click to browse
                            </p>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                            PDF, JPG, PNG (Max 10MB)
                        </div>
                    </>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-500 flex items-center gap-2 px-1 animate-in slide-in-from-top-1">
                    <X className="h-3 w-3" /> {error}
                </p>
            )}
        </div>
    )
}
