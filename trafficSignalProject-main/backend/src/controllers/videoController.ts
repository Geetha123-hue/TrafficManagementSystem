import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

interface UploadResponse {
  success: boolean;
  message: string;
  videoId?: string;
  fileName?: string;
  fileSize?: number;
  processingStatus?: string;
}

// In-memory store for video metadata (would be a DB in production)
const videoMetadataStore = new Map<string, any>();
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Handle video upload
export const uploadVideo = (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No video file provided'
      });
      return;
    }

    const { filename, originalname, size } = req.file;
    const videoId = path.parse(filename).name;

    // Store metadata
    const metadata = {
      id: videoId,
      fileName: originalname,
      storedName: filename,
      fileSize: size,
      uploadDate: new Date().toISOString(),
      status: 'completed', // For now, we mark as completed since processing is simulated
      processingStatus: 'completed'
    };

    videoMetadataStore.set(videoId, metadata);

    const response: UploadResponse = {
      success: true,
      message: 'Video uploaded successfully',
      videoId: videoId,
      fileName: originalname,
      fileSize: size,
      processingStatus: 'completed'
    };

    res.json(response);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video'
    });
  }
};

// Get upload status
export const getUploadStatus = (req: Request, res: Response): void => {
  try {
    const { videoId } = req.params;
    const metadata = videoMetadataStore.get(videoId);

    if (!metadata) {
      res.status(404).json({
        success: false,
        message: 'Video not found'
      });
      return;
    }

    res.json({
      success: true,
      videoId: videoId,
      status: metadata.status,
      progress: 100,
      message: `Video processing is ${metadata.status}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upload status'
    });
  }
};

// Get analysis results
export const getAnalysisResults = (req: Request, res: Response): void => {
  try {
    const { videoId } = req.params;
    const metadata = videoMetadataStore.get(videoId);

    if (!metadata) {
      res.status(404).json({
        success: false,
        message: 'Video not found'
      });
      return;
    }

    res.json({
      success: true,
      videoId: videoId,
      analysis: {
        totalFrames: 1800,
        duration: '60s',
        vehiclesDetected: Math.floor(Math.random() * 300) + 100,
        violationsDetected: Math.floor(Math.random() * 20),
        averageSpeed: 42,
        peakCongestion: 78,
        signalOptimizationSuggestion: 'Extend green phase for north-south direction by 5 seconds'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis results'
    });
  }
};

// Get all uploaded videos
export const getUploadedVideos = (req: Request, res: Response): void => {
  try {
    const videos = Array.from(videoMetadataStore.values()).map(meta => ({
      id: meta.id,
      fileName: meta.fileName,
      uploadDate: meta.uploadDate,
      status: meta.status,
      duration: 300, // Simulated
      fileSize: meta.fileSize,
      analysis: {
        vehiclesDetected: Math.floor(Math.random() * 300) + 100,
        violationsDetected: Math.floor(Math.random() * 15)
      }
    }));

    res.json({
      success: true,
      videos: videos,
      total: videos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching videos'
    });
  }
};
