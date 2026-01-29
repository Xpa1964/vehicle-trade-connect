
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
    console.warn('⚠️ VirusTotal API key not configured - skipping virus scan');
    return { safe: true }; // Allow upload but log warning
  }

  try {
    console.log('🛡️ Scanning file with VirusTotal:', file.name);
    
    // Prepare file for upload to VirusTotal
    const formData = new FormData();
    formData.append('file', file);

    // Upload file to VirusTotal for scanning
    const uploadResponse = await fetch('https://www.virustotal.com/api/v3/files', {
      method: 'POST',
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('❌ VirusTotal upload failed:', errorText);
      
      // If rate limit exceeded, allow upload but log warning
      if (uploadResponse.status === 429) {
        console.warn('⚠️ VirusTotal rate limit exceeded - allowing upload');
        return { safe: true, error: 'rate_limit_exceeded' };
      }
      
      throw new Error(`VirusTotal API error: ${uploadResponse.status}`);
    }

    const uploadResult = await uploadResponse.json();
    const scanId = uploadResult.data?.id;

    if (!scanId) {
      console.warn('⚠️ No scan ID received from VirusTotal');
      return { safe: true };
    }

    console.log('🔍 Scan initiated, ID:', scanId);

    // Wait a bit for the scan to complete (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get scan results
    const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${scanId}`, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
    });

    if (!analysisResponse.ok) {
      console.warn('⚠️ Could not retrieve scan results - allowing upload');
      return { safe: true, scanId };
    }

    const analysisResult = await analysisResponse.json();
    const stats = analysisResult.data?.attributes?.stats;

    if (!stats) {
      console.warn('⚠️ No scan statistics available - allowing upload');
      return { safe: true, scanId };
    }

    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const totalDetections = malicious + suspicious;

    console.log(`📊 Scan results - Malicious: ${malicious}, Suspicious: ${suspicious}`);

    if (totalDetections > 0) {
      console.error(`❌ THREAT DETECTED: ${totalDetections} engines flagged this file`);
      return {
        safe: false,
        scanId,
        detections: totalDetections,
      };
    }

    console.log('✅ File is clean - no threats detected');
    return { safe: true, scanId, detections: 0 };

  } catch (error: unknown) {
    console.error('❌ VirusTotal scan error:', error);
    // On error, log but allow upload (fail open to not break functionality)
    return { safe: true, error: error instanceof Error ? error.message : String(error) };
  }
}
