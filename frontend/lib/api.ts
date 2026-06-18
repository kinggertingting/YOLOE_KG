import { mockDetectionResults } from './mockData';

export interface UploadVideoRequest {
  file: File;
}

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
 * Upload video file for detection processing
 * TODO: Connect to FastAPI backend endpoint POST /detect
 */
export async function uploadAndDetectVideo(
  file: File,
  config: ConfigParams
): Promise<DetectionResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('detectionMode', config.detectionMode);
  formData.append('confidenceThreshold', config.confidenceThreshold.toString());

  // TODO: Replace with actual API call
  // const response = await fetch('/api/detect', {
  //   method: 'POST',
  //   body: formData,
  // });
  // return response.json();

  // Mock implementation - simulates processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        jobId: `job_${Date.now()}`,
        status: 'processing',
      });
    }, 500);
  });
}

/**
 * Get detection results for a specific job
 * TODO: Connect to FastAPI backend endpoint GET /result/{job_id}
 */
export async function getDetectionResults(jobId: string): Promise<DetectionResponse> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/result/${jobId}`);
  // return response.json();

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDetectionResults);
    }, 2000);
  });
}

/**
 * Get processed video file
 * TODO: Connect to FastAPI backend endpoint GET /video/{job_id}
 */
export async function getProcessedVideo(jobId: string): Promise<Blob> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/video/${jobId}`);
  // return response.blob();

  throw new Error('Video download not yet implemented');
}

/**
 * Get metrics data for a job
 * TODO: Connect to FastAPI backend endpoint GET /metrics/{job_id}
 */
export async function getMetricsData(jobId: string) {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/metrics/${jobId}`);
  // return response.json();

  // Mock implementation
  return mockDetectionResults.metrics;
}
