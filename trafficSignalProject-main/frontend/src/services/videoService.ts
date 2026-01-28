// Video service for API communication
const API_BASE_URL = 'http://localhost:5001/api';

export interface VideoUploadResponse {
  success: boolean;
  message: string;
  videoId?: string;
  fileName?: string;
  fileSize?: number;
  processingStatus?: string;
}

export interface VideoStatus {
  success: boolean;
  videoId: string;
  status: 'queued' | 'processing' | 'analyzing' | 'completed';
  progress: number;
  message: string;
}

export interface VideoAnalysis {
  success: boolean;
  videoId: string;
  analysis?: {
    totalFrames: number;
    duration: string;
    vehiclesDetected: number;
    violationsDetected: number;
    averageSpeed: number;
    peakCongestion: number;
    signalOptimizationSuggestion: string;
  };
}

export interface UploadedVideo {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'queued' | 'processing' | 'analyzing' | 'completed';
  duration: number;
  fileSize: number;
  analysis?: {
    vehiclesDetected: number;
    violationsDetected: number;
  };
}

export const videoService = {
  async uploadVideo(file: File): Promise<VideoUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch(`${API_BASE_URL}/video/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading video:', error);
      return {
        success: false,
        message: 'Failed to upload video. Please try again.',
      };
    }
  },

  async getUploadStatus(videoId: string): Promise<VideoStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/video/${videoId}/status`);

      if (!response.ok) {
        throw new Error('Failed to fetch upload status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching upload status:', error);
      return {
        success: false,
        videoId: videoId,
        status: 'queued',
        progress: 0,
        message: 'Error fetching status',
      };
    }
  },

  async getAnalysisResults(videoId: string): Promise<VideoAnalysis> {
    try {
      const response = await fetch(`${API_BASE_URL}/video/${videoId}/analysis`);

      if (!response.ok) {
        throw new Error('Failed to fetch analysis results');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analysis results:', error);
      return {
        success: false,
        videoId: videoId,
      };
    }
  },

  async getUploadedVideos(): Promise<{ success: boolean; videos: UploadedVideo[]; total: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/videos`);

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching videos:', error);
      return {
        success: false,
        videos: [],
        total: 0,
      };
    }
  },
};
