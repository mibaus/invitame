'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const BUCKET_NAME = 'invitations';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

function isConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('tu-proyecto'));
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
}

export interface UploadMultipleResult {
  success: boolean;
  urls: string[];
  errors: string[];
}

export async function uploadImage(
  formData: FormData,
  folder: string = 'uploads'
): Promise<UploadResult> {
  const file = formData.get('file') as File | null;

  if (!file) {
    return { success: false, error: 'No se proporcionó ningún archivo.' };
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      success: false, 
      error: 'Formato no permitido. Usa JPG, PNG o WebP.' 
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      success: false, 
      error: 'El archivo excede el límite de 5MB.' 
    };
  }

  // Development mode fallback
  if (!isConfigured()) {
    console.log('[Dev Mode] Image upload simulated:', file.name);
    const fakeUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
    return {
      success: true,
      url: fakeUrl,
      fileName: file.name,
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${timestamp}-${randomId}.${extension}`;
    const filePath = `${folder}/${fileName}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: 'Error al subir la imagen.' };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      fileName: fileName,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Error inesperado al subir la imagen.' };
  }
}

export async function uploadMultipleImages(
  formData: FormData,
  folder: string = 'uploads'
): Promise<UploadMultipleResult> {
  const files = formData.getAll('files') as File[];

  if (!files || files.length === 0) {
    return { success: false, urls: [], errors: ['No se proporcionaron archivos.'] };
  }

  const results: UploadResult[] = [];

  for (const file of files) {
    const singleFormData = new FormData();
    singleFormData.append('file', file);
    const result = await uploadImage(singleFormData, folder);
    results.push(result);
  }

  const urls = results.filter(r => r.success && r.url).map(r => r.url!);
  const errors = results.filter(r => !r.success && r.error).map(r => r.error!);

  return {
    success: errors.length === 0,
    urls,
    errors,
  };
}

export async function deleteImage(filePath: string): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured()) {
    console.log('[Dev Mode] Image delete simulated:', filePath);
    return { success: true };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
      return { success: false, error: 'Error al eliminar la imagen.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Error inesperado al eliminar la imagen.' };
  }
}
