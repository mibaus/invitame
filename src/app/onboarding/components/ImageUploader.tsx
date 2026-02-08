'use client';

import { useState, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('[ImageUploader] Supabase URL configured:', !!supabaseUrl && !supabaseUrl.includes('tu-proyecto'));
console.log('[ImageUploader] Supabase Key configured:', !!supabaseAnonKey && supabaseAnonKey.length > 10);

// Create Supabase client for client-side uploads
const supabase = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('tu-proyecto') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.log('[ImageUploader] Supabase client not created - will use dev mode');
}

interface ImageUploaderProps {
  folder?: string;
  onUpload?: (url: string) => void;
  onChange?: (url: string) => void;
  currentImage?: string;
  value?: string;
  label?: string;
  hint?: string;
  className?: string;
  maxSizeMB?: number;
}

interface MultiImageUploaderProps {
  folder: string;
  onUpload: (urls: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
  label?: string;
  hint?: string;
  className?: string;
}

export function ImageUploader({
  folder = 'temp',
  onUpload,
  onChange,
  currentImage,
  value,
  label = 'Imagen',
  hint,
  className = '',
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || currentImage || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    
    // Validate file size before uploading (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es muy grande. Máximo 5MB.');
      return;
    }
    
    setIsUploading(true);

    // Create preview using object URL (more efficient than data URL)
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      console.log('[ImageUploader] Uploading file:', file.name, file.type, file.size);
      
      if (!supabase) {
        // Dev mode - simulate upload
        console.log('[Dev Mode] Simulating upload');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const fakeUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
        URL.revokeObjectURL(objectUrl);
        setPreview(fakeUrl);
        onUpload?.(fakeUrl);
        onChange?.(fakeUrl);
        setIsUploading(false);
        return;
      }

      // Upload directly to Supabase Storage from client
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${timestamp}-${randomId}.${extension}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invitations')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        setError('Error al subir la imagen: ' + uploadError.message);
        URL.revokeObjectURL(objectUrl);
        setPreview(value || currentImage || null);
        setIsUploading(false);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('invitations')
        .getPublicUrl(filePath);

      console.log('[ImageUploader] Upload successful:', urlData.publicUrl);
      URL.revokeObjectURL(objectUrl);
      setPreview(urlData.publicUrl);
      onUpload?.(urlData.publicUrl);
      onChange?.(urlData.publicUrl);
    } catch (err: any) {
      console.error('[ImageUploader] Upload error:', err);
      setError(`Error al procesar: ${err.message || 'Error desconocido'}`);
      URL.revokeObjectURL(objectUrl);
      setPreview(value || currentImage || null);
    } finally {
      setIsUploading(false);
    }
  }, [folder, onUpload, onChange, currentImage, value]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    onUpload?.('');
    onChange?.('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onUpload, onChange]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        {preview ? (
          <div className="relative aspect-video">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <Spinner />
                  <span className="text-sm">Subiendo...</span>
                </div>
              </div>
            )}
            {!isUploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Arrastra una imagen o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-400">
              JPG, PNG o WebP • Máximo 5MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {hint && !error && (
        <p className="mt-2 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}

export function MultiImageUploader({
  folder,
  onUpload,
  currentImages = [],
  maxImages = 15,
  label = 'Galería de imágenes',
  hint,
  className = '',
}: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    setError(null);

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setIsUploading(true);

    const newUrls: string[] = [];
    const uploadErrors: string[] = [];
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        uploadErrors.push(`${file.name}: No es una imagen`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        uploadErrors.push(`${file.name}: Muy grande (máx 5MB)`);
        continue;
      }

      try {
        if (!supabase) {
          const fakeUrl = `https://picsum.photos/seed/${Date.now()}-${Math.random()}/800/600`;
          newUrls.push(fakeUrl);
          continue;
        }

        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${timestamp}-${randomId}.${extension}`;
        const filePath = `${folder}/${fileName}`;

        console.log('[ImageUploader] File path:', filePath);

        // Add timeout to prevent hanging
        const uploadWithTimeout = Promise.race([
          supabase.storage
            .from('invitations')
            .upload(filePath, file, {
              contentType: file.type,
              upsert: false,
            }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout - upload took too long')), 30000)
          )
        ]);

        const { error: uploadError } = await uploadWithTimeout as any;

        if (uploadError) {
          console.error('[ImageUploader] Upload error:', uploadError);
          uploadErrors.push(`${file.name}: ${uploadError.message}`);
          continue;
        }

        console.log('[ImageUploader] Upload successful, getting public URL...');

        const { data: urlData } = supabase.storage
          .from('invitations')
          .getPublicUrl(filePath);

        newUrls.push(urlData.publicUrl);
      } catch (err: any) {
        console.error('[ImageUploader] Exception for file:', file.name, err);
        uploadErrors.push(`${file.name}: ${err.message || 'Error desconocido'}`);
      }
    }

    console.log('[ImageUploader] Upload loop complete. New URLs:', newUrls.length, 'Errors:', uploadErrors.length);

    if (newUrls.length > 0) {
      console.log('[ImageUploader] Updating state with', newUrls.length, 'new images');
      const updatedImages = [...images, ...newUrls];
      setImages(updatedImages);
      onUpload(updatedImages);
    }

    if (uploadErrors.length > 0) {
      console.error('[ImageUploader] Upload errors:', uploadErrors);
      setError(uploadErrors[0] + (uploadErrors.length > 1 ? ` y ${uploadErrors.length - 1} más` : ''));
    }

    console.log('[ImageUploader] Setting isUploading to false');
    setIsUploading(false);
  }, [folder, images, maxImages, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleRemove = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUpload(newImages);
  }, [images, onUpload]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          <span className="text-gray-400 font-normal ml-2">
            ({images.length}/{maxImages})
          </span>
        </label>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-stone-800/80 hover:bg-stone-700 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-lg transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          <div className="p-6 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-gray-600">
                <Spinner />
                <span className="text-sm">Subiendo imágenes...</span>
              </div>
            ) : (
              <>
                <div className="mx-auto w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Agregar más imágenes
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG o WebP • Máximo 5MB cada una
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {hint && !error && (
        <p className="mt-2 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
