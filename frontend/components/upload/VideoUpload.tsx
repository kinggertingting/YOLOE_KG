'use client';

import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface VideoUploadProps {
  onFileSelect: (file: File) => void;
}

export function VideoUpload({ onFileSelect }: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && isVideoFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isVideoFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const isVideoFile = (file: File) => {
    return ['video/mp4', 'video/avi', 'video/quicktime'].includes(file.type) ||
           /\.(mp4|avi|mov)$/i.test(file.name);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="mb-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`glass-strong rounded-lg border-2 border-dashed border-blue-400/50 p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-cyan-400 bg-cyan-400/10 scale-105'
            : 'hover:border-cyan-400 hover:bg-cyan-400/5'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".mp4,.avi,.mov,video/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <Upload className="mx-auto h-12 w-12 text-cyan-400 mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Drop your video here or click to select
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Supported formats: MP4, AVI, MOV (max 2GB)
        </p>
        {selectedFile && (
          <div className="inline-block rounded-lg glass px-4 py-3 text-left">
            <p className="text-sm font-medium text-cyan-400">
              📹 {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Size: {formatFileSize(selectedFile.size)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
