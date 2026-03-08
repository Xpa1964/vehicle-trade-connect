
const VIRUSTOTAL_API_KEY = Deno.env.get('VIRUSTOTAL_API_KEY');

interface VirusTotalScanResult {
  safe: boolean;
  scanId?: string;
  detections?: number;
  error?: string;
}

/**
 * Scan file with VirusTotal API
 * Note: Free tier has rate limits (4 requests/min, 500/day)
 */
export async function scanFileWithVirusTotal(file: File): Promise<VirusTotalScanResult> {
  if (!VIRUSTOTAL_API_KEY) {
    console.error('VirusTotal API key not configured - skipping virus scan');
    return { safe: true };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch('https://www.virustotal.com/api/v3/files', {
      method: 'POST',
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('VirusTotal upload failed:', errorText);
      
      if (uploadResponse.status === 429) {
        return { safe: true, error: 'rate_limit_exceeded' };
      }
      
      throw new Error(`VirusTotal API error: ${uploadResponse.status}`);
    }

    const uploadResult = await uploadResponse.json();
    const scanId = uploadResult.data?.id;

    if (!scanId) {
      return { safe: true };
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${scanId}`, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
    });

    if (!analysisResponse.ok) {
      return { safe: true, scanId };
    }

    const analysisResult = await analysisResponse.json();
    const stats = analysisResult.data?.attributes?.stats;

    if (!stats) {
      return { safe: true, scanId };
    }

    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const totalDetections = malicious + suspicious;

    if (totalDetections > 0) {
      console.error(`Threat detected: ${totalDetections} engines flagged this file`);
      return {
        safe: false,
        scanId,
        detections: totalDetections,
      };
    }

    return { safe: true, scanId, detections: 0 };

  } catch (error: unknown) {
    console.error('VirusTotal scan error:', error instanceof Error ? error.message : String(error));
    return { safe: true, error: error instanceof Error ? error.message : String(error) };
  }
}