'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle2, Camera, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import { uploadFile } from '@/app/actions/upload-file'

interface FileUploadProps {
    onUploadComplete: (url: string, fileData?: any) => void;
    folder?: string;
    label?: string;
    accept?: string;
    currentFileUrl?: string | null;
    disabled?: boolean;
    showCamera?: boolean;
    className?: string;
}

export function FileUpload({
    onUploadComplete,
    folder = 'documents',
    label = "Upload Document",
    accept = "application/pdf,image/*",
    currentFileUrl,
    disabled = false,
    showCamera = false,
    className = "",
    maxSizeInBytes = 10 * 1024 * 1024 // 10MB default
}: FileUploadProps & { maxSizeInBytes?: number }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl || null);
    const [error, setError] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Stop camera stream on unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    // Sync previewUrl with currentFileUrl from props
    useEffect(() => {
        setPreviewUrl(currentFileUrl || null);
        // If external clear happened, clear the input so same file can be selected again
        if (!currentFileUrl && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [currentFileUrl]);

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

    const startCamera = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
            });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraActive(true);
        } catch (err) {
            setError("Unable to access camera. Please verify permissions.");
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setIsCameraActive(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Set canvas size to match video resolution
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context?.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Compress to JPEG 0.8
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setPreviewUrl(dataUrl);
            onUploadComplete(dataUrl);
            stopCamera();
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
                    const MAX_WIDTH = 600;
                    const MAX_HEIGHT = 600;
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

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
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
            if (file.type.startsWith('image/')) {
                const dataUrl = await compressImage(file);
                setPreviewUrl(dataUrl);
                onUploadComplete(dataUrl);
                setIsUploading(false);
                return;
            }

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
            setError("Upload failed.");
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        onUploadComplete("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="w-full space-y-2">
            <div
                className={`
                    relative group transition-all duration-300
                    border-2 border-dashed rounded-3xl p-4 overflow-hidden
                    flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/20
                    ${isDragging ? 'border-indigo-500 bg-indigo-50/30 scale-[1.01]' : 'border-slate-200 dark:border-slate-800'}
                    ${previewUrl ? 'border-emerald-500/30 bg-emerald-50/10' : ''}
                    ${className}
                `}
                onDragEnter={disabled || isCameraActive ? undefined : handleDrag}
                onDragLeave={disabled || isCameraActive ? undefined : handleDrag}
                onDragOver={disabled || isCameraActive ? undefined : handleDrag}
                onDrop={disabled || isCameraActive ? undefined : handleDrop}
            >
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleChange} accept={accept} />
                <canvas ref={canvasRef} className="hidden" />

                {isCameraActive ? (
                    <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="relative aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-black shadow-2xl border-2 border-indigo-500/20">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover mirror transform -scale-x-100"
                            />
                            <div className="absolute top-2 left-2 px-2 py-1 bg-indigo-600/80 backdrop-blur-md rounded text-[10px] text-white font-black uppercase tracking-widest flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                Live Acquisition
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={stopCamera}
                                className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-300 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={capturePhoto}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <Sparkles className="h-4 w-4" />
                                Capture Snapshot
                            </button>
                        </div>
                    </div>
                ) : isUploading ? (
                    <div className="py-6 flex flex-col items-center">
                        <RefreshCw className="h-10 w-10 text-indigo-500 animate-spin mb-3" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Encrypting Artifact...</p>
                    </div>
                ) : previewUrl ? (
                    <div className="flex items-center gap-4 w-full p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="h-16 w-16 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800">
                            {previewUrl.toLowerCase().endsWith('.pdf') ? (
                                <FileText className="h-8 w-8 text-emerald-600" />
                            ) : (
                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Synchronization Secure</p>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-xs font-black text-slate-700 dark:text-slate-200">Asset Ready</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={clearFile}
                            className="h-10 w-10 flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="w-full py-4 flex flex-col items-center gap-4">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-200 group/upload"
                            >
                                <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover/upload:scale-110 transition-all">
                                    <Upload className="h-6 w-6 text-indigo-500" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Cloud Upload</span>
                            </button>

                            {showCamera && (
                                <button
                                    type="button"
                                    onClick={startCamera}
                                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-200 group/camera"
                                >
                                    <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover/camera:scale-110 transition-all">
                                        <Camera className="h-6 w-6 text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Bio Capture</span>
                                </button>
                            )}
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</p>
                            <p className="text-[9px] text-slate-400 font-mono tracking-tighter italic">DRAG & DROP SUPPORTED • MAX {Math.round(maxSizeInBytes / (1024 * 1024))}MB</p>
                        </div>
                    </div>
                )}
            </div>

            {
                error && (
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 px-2 animate-in slide-in-from-top-1">
                        <AlertCircle className="h-3.5 w-3.5" /> {error}
                    </p>
                )
            }
        </div >
    )
}
