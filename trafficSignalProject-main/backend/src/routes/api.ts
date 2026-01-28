import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as trafficController from '../controllers/trafficController';
import * as chatbotController from '../controllers/chatbotController';
import * as videoController from '../controllers/videoController';

const router = Router();

// Configure multer for video storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit
    }
});

// Traffic routes
router.get('/metrics', trafficController.getMetrics);
router.get('/violations', trafficController.getViolations);
router.get('/queue', trafficController.getQueueData);

// Chatbot routes
router.post('/chat/message', chatbotController.sendMessage);
router.get('/chat/history', chatbotController.getChatHistory);

// Video routes
router.post('/video/upload', upload.single('video'), videoController.uploadVideo);
router.get('/video/:videoId/status', videoController.getUploadStatus);
router.get('/video/:videoId/analysis', videoController.getAnalysisResults);
router.get('/videos', videoController.getUploadedVideos);

export default router;
