import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Play, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { videoService } from '@/services/videoService';
import { useVideo } from '@/contexts/VideoContext';

interface LocalUploadVideo {
  id: string;
  name: string;
  size: number;
  duration?: number;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  preview?: string;
  fileData?: Blob;
}

interface VideoUploadModuleProps {
  onVideoSelected?: (file: File) => void;
}

export default function VideoUploadModule({ onVideoSelected }: VideoUploadModuleProps) {
  const [videos, setVideos] = useState<LocalUploadVideo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadedVideos, addVideo, setCurrentVideo } = useVideo();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Load previously uploaded videos from context
  useEffect(() => {
    if (uploadedVideos.length > 0) {
      const contextVideos: LocalUploadVideo[] = uploadedVideos.map(v => ({
        id: v.id,
        name: v.name,
        size: v.size,
        duration: v.duration,
        progress: 100,
        status: v.status as LocalUploadVideo['status'],
        error: v.error,
        preview: v.preview,
        uploadedAt: v.uploadedAt,
      }));
      setVideos(prev => {
        // Avoid duplicates
        const existingIds = new Set(prev.map(v => v.id));
        const newVideos = contextVideos.filter(v => !existingIds.has(v.id));
        return [...prev, ...newVideos];
      });
    }
  }, [uploadedVideos]);

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processVideo = async (file: File) => {
    const tempVideoId = Date.now().toString();
    const newVideo: LocalUploadVideo = {
      id: tempVideoId,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
      fileData: file,
    };

    setVideos(prev => [...prev, newVideo]);

    try {
      // Use the actual video service for upload
      const response = await videoService.uploadVideo(file);

      if (response.success && response.videoId) {
        // Update with real video ID and change status
        setVideos(prev =>
          prev.map(v =>
            v.id === tempVideoId
              ? { ...v, id: response.videoId!, progress: 100, status: 'processing' }
              : v
          )
        );

        // Simulate processing delay for UI feedback
        setTimeout(() => {
          const completedVideo: LocalUploadVideo = {
            id: response.videoId!,
            name: file.name,
            size: file.size,
            status: 'completed',
            duration: Math.floor(Math.random() * 300) + 60,
            progress: 100,
            fileData: file,
            uploadedAt: new Date().toISOString(),
          };
          
          setVideos(prev =>
            prev.map(v =>
              v.id === response.videoId
                ? completedVideo
                : v
            )
          );
          
          // Add to global context for persistence
          addVideo(completedVideo);
          setCurrentVideo(completedVideo);
          
          // Trigger callback with the file
          onVideoSelected?.(file);
        }, 2000);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error: any) {
      setVideos(prev =>
        prev.map(v =>
          v.id === tempVideoId
            ? { ...v, status: 'error', error: error.message || 'Upload failed' }
            : v
        )
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('video/')
    );

    files.forEach(file => processVideo(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith('video/')
    );

    files.forEach(file => processVideo(file));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <GlassPanel className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Video Input Module</h2>
        <p className="text-sm text-muted-foreground">Upload traffic surveillance videos for AI analysis</p>
      </div>

      {/* Upload Area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${isDragging
          ? 'border-primary bg-primary/10 scale-105'
          : 'border-border bg-background/50 hover:border-primary/50'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ y: isDragging ? -5 : 0 }}
            className="p-4 rounded-full bg-primary/10 border border-primary/30"
          >
            <Upload className="text-primary" size={32} />
          </motion.div>

          <div className="text-center">
            <p className="font-semibold text-foreground">
              {isDragging ? 'Drop videos here' : 'Drag videos here or click to browse'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: MP4, AVI, MOV, MKV (Max 500MB per file)
            </p>
          </div>

          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} className="mr-2" />
            Select Videos
          </Button>
        </div>
      </motion.div>

      {/* Uploaded Videos List */}
      {videos.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Uploaded Videos ({videos.length})</h3>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors"
              >
                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  {video.status === 'uploading' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Loader className="text-blue-500" size={20} />
                    </motion.div>
                  )}
                  {video.status === 'processing' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Loader className="text-yellow-500" size={20} />
                    </motion.div>
                  )}
                  {video.status === 'completed' && (
                    <CheckCircle className="text-green-500" size={20} />
                  )}
                  {video.status === 'error' && (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                </div>

                {/* Video Info */}
                <div className="flex items-start gap-4 pr-8">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <Play className="text-primary" size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{video.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(video.size)}
                      </span>
                      {video.duration && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(video.duration)}
                          </span>
                        </>
                      )}
                      {video.error && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-red-500">{video.error}</span>
                        </>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {(video.status === 'uploading' || video.status === 'processing') && (
                      <div className="w-full bg-background rounded-full h-2 mt-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${video.progress}%` }}
                          className={`h-full rounded-full ${video.status === 'uploading'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                            }`}
                        />
                      </div>
                    )}

                    {/* Status Label */}
                    <div className="mt-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${video.status === 'uploading'
                        ? 'bg-blue-500/20 text-blue-500'
                        : video.status === 'processing'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : video.status === 'completed'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                        {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeVideo(video.id)}
                  className="absolute top-3 right-3 p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <X className="text-muted-foreground hover:text-destructive" size={18} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      {videos.length > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{videos.length}</p>
            <p className="text-xs text-muted-foreground">Total Videos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {videos.filter(v => v.status === 'completed').length}
            </p>
            <p className="text-xs text-muted-foreground">Processed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {formatFileSize(videos.reduce((sum, v) => sum + v.size, 0))}
            </p>
            <p className="text-xs text-muted-foreground">Total Size</p>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
