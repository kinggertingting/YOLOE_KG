import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

function getApiOrigin(): string {
  return new URL(API_BASE_URL, window.location.origin).origin;
}

function normalizeVideoUrl(videoUrl: string): string {
  const apiOrigin = getApiOrigin();
  const parsedUrl = new URL(videoUrl, apiOrigin);
  const parsedApiOrigin = new URL(apiOrigin);

  const shouldUseApiOrigin =
    parsedUrl.hostname === parsedApiOrigin.hostname ||
    ['localhost', '127.0.0.1', '0.0.0.0'].includes(parsedUrl.hostname);

  if (shouldUseApiOrigin) {
    parsedUrl.protocol = parsedApiOrigin.protocol;
    parsedUrl.hostname = parsedApiOrigin.hostname;
    parsedUrl.port = parsedApiOrigin.port;
  }

  return parsedUrl.href;
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

/** Response from POST /api/v1/detect-video */
export interface DetectVideoResult {
  video_url: string;      // Absolute public URL, e.g. https://yoloe.duckdns.org/uploads/detected_xxx.mp4
  filename: string;
  jobId: string;
}

/**
 * Upload video file for detection processing.
 * Backend processes the video and returns a JSON with video_url
 * pointing to the processed file served via StaticFiles at /uploads.
 * 
 * The returned video_url can be used directly in a <video> tag:
 *   <video src={result.video_url} controls />
 */
export async function uploadAndDetectVideo(
  file: File
): Promise<DetectVideoResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('device', 'cuda');

  const response = await api.post('/api/v1/detect-video', formData, {
    timeout: 300000,
    validateStatus: () => true,
  });

  // Check if response is not OK
  if (response.status >= 400) {
    let errorMessage = `Backend error (${response.status})`;
    try {
      const errorJson = response.data;
      errorMessage = errorJson.detail || errorMessage;
    } catch {
      // ignore parse error
    }
    throw new Error(errorMessage);
  }

  const result = response.data as DetectVideoResult;

  return {
    ...result,
    video_url: normalizeVideoUrl(result.video_url),
  };
}
