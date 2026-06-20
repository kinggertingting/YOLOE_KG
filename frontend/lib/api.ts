import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface ConfigParams {
  detectionMode: 'seen' | 'unseen' | 'both';
  confidenceThreshold: number;
}

export interface DetectionResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingTime?: number;
  totalFrames?: number;
  detectedObjects?: number;
  seenClasses?: number;
  unseenClasses?: number;
  metrics?: {
    precision: number;
    recall: number;
    mAP50: number;
    mAP5095: number;
    fps: number;
    inferenceTime: number;
    avgConfidence: number;
    totalObjects: number;
  };
  performanceData?: Array<{
    frame: number;
    precision: number;
    recall: number;
    mAP: number;
  }>;
  fpsData?: Array<{
    frame: number;
    fps: number;
  }>;
  classDistribution?: Array<{
    name: string;
    value: number;
    type: 'seen' | 'unseen';
  }>;
  detections?: Array<{
    id: number;
    frameId: number;
    class: string;
    type: 'seen' | 'unseen';
    confidence: number;
    bbox: string;
    status: string;
  }>;
}

/**
 * Upload video file for detection processing.
 * Backend returns the processed video file directly via POST /detect-video.
 * Returns the response blob and the filename from Content-Disposition header.
 */
export async function uploadAndDetectVideo(
  file: File,
  _config: ConfigParams
): Promise<{ blob: Blob; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/detect-video', formData, {
    responseType: 'blob',
    timeout: 300000, // 5 minutes for long video processing
    validateStatus: () => true, // handle status manually
  });

  // Check if response is not OK
  if (response.status >= 400) {
    let errorMessage = `Backend error (${response.status})`;
    try {
      // Try to parse error from blob response
      const errorText = await (response.data as Blob).text();
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorMessage;
    } catch {
      // ignore parse error
    }
    throw new Error(errorMessage);
  }

  // Extract filename from Content-Disposition header
  const disposition = response.headers['content-disposition'];
  let filename = `detected_${file.name}`;
  if (disposition) {
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match) {
      filename = match[1].replace(/['"]/g, '');
    }
  }

  return { blob: response.data as Blob, filename };
}

/**
 * Get processed video as blob (for download / display).
 */
export async function getProcessedVideo(jobId: string): Promise<Blob> {
  const response = await api.get(`/video/${jobId}`, {
    responseType: 'blob',
  });
  return response.data as Blob;
}