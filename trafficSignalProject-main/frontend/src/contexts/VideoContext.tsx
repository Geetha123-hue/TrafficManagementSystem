import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UploadedVideo {
  id: string;
  name: string;
  size: number;
  duration?: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  preview?: string;
  uploadedAt: string;
  fileData?: Blob;
}

interface VideoContextType {
  uploadedVideos: UploadedVideo[];
  currentVideo: UploadedVideo | null;
  addVideo: (video: UploadedVideo) => void;
  updateVideo: (id: string, updates: Partial<UploadedVideo>) => void;
  removeVideo: (id: string) => void;
  setCurrentVideo: (video: UploadedVideo | null) => void;
  clearAll: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>(() => {
    // Load from localStorage on initialization
    const stored = localStorage.getItem('uploadedVideos');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.filter((v: UploadedVideo) => v.status === 'completed');
      } catch {
        return [];
      }
    }
    return [];
  });

  const [currentVideo, setCurrentVideo] = useState<UploadedVideo | null>(() => {
    const stored = localStorage.getItem('currentVideo');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Persist videos to localStorage
  useEffect(() => {
    localStorage.setItem('uploadedVideos', JSON.stringify(
      uploadedVideos.map(v => ({
        ...v,
        fileData: undefined // Don't store blob in localStorage
      }))
    ));
  }, [uploadedVideos]);

  // Persist current video to localStorage
  useEffect(() => {
    if (currentVideo) {
      localStorage.setItem('currentVideo', JSON.stringify({
        ...currentVideo,
        fileData: undefined
      }));
    } else {
      localStorage.removeItem('currentVideo');
    }
  }, [currentVideo]);

  const addVideo = (video: UploadedVideo) => {
    setUploadedVideos(prev => {
      const exists = prev.find(v => v.id === video.id);
      if (exists) {
        return prev.map(v => v.id === video.id ? video : v);
      }
      return [...prev, video];
    });
  };

  const updateVideo = (id: string, updates: Partial<UploadedVideo>) => {
    setUploadedVideos(prev =>
      prev.map(v => v.id === id ? { ...v, ...updates } : v)
    );

    if (currentVideo?.id === id) {
      setCurrentVideo(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const removeVideo = (id: string) => {
    setUploadedVideos(prev => prev.filter(v => v.id !== id));
    if (currentVideo?.id === id) {
      setCurrentVideo(null);
    }
  };

  const clearAll = () => {
    setUploadedVideos([]);
    setCurrentVideo(null);
    localStorage.removeItem('uploadedVideos');
    localStorage.removeItem('currentVideo');
  };

  return (
    <VideoContext.Provider value={{
      uploadedVideos,
      currentVideo,
      addVideo,
      updateVideo,
      removeVideo,
      setCurrentVideo,
      clearAll,
    }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within VideoProvider');
  }
  return context;
}
