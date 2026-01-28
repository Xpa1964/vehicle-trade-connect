
export async function logAudit(supabase: any, userId: string, filePath: string, bucketName: string, now: Date, extraDetails: any = {}) {
  await supabase
    .from('activity_logs')
    .insert({
      user_id: userId,
      action_type: extraDetails.action || "file_upload",
      entity_type: "file_upload", 
      details: {
        filePath,
        bucketName,
        uploaded_at: now.toISOString(),
        ...extraDetails
      },
      severity: extraDetails.action === 'virus_detected' ? "critical" : "info"
    });
}
