
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads a file through the secure-file-upload Edge Function.
 * Provides MIME validation, virus scanning, rate limiting, and audit logging.
 * 
 * @returns The public URL of the uploaded file, or null on failure.
 */
export async function uploadFileSecurely(
  file: File,
  bucket: string,
  folder?: string
): Promise<{ publicUrl: string | null; error?: string }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
      return { publicUrl: null, error: 'No authenticated session' };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    if (folder) {
      formData.append('folder', folder);
    }

    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const url = `https://${projectId}.supabase.co/functions/v1/secure-file-upload`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('❌ [secureUpload] Edge function error:', result.error || result.details);
      return { publicUrl: null, error: result.error || 'Upload failed' };
    }

    // Construct public URL from the returned path
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(result.path);

    return { publicUrl };
  } catch (error) {
    console.error('❌ [secureUpload] Unexpected error:', error);
    return { publicUrl: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
