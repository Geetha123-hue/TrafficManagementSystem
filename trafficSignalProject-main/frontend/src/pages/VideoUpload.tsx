import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoUploadModule from '@/components/dashboard/VideoUploadModule';

export default function VideoUpload() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          Back to Dashboard
        </motion.button>

        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Video Upload</h1>
          <p className="text-muted-foreground">
            Upload traffic surveillance videos for real-time AI analysis and optimization
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <VideoUploadModule />
      </div>
    </div>
  );
}
