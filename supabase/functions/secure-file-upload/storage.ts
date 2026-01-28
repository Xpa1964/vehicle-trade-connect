
export async function uploadFileToSupabaseStorage(supabase: any, bucketName: string, filePath: string, file: File) {
  const uploadOptions = {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type
  }

  return await supabase.storage
    .from(bucketName)
    .upload(filePath, file, uploadOptions)
}
