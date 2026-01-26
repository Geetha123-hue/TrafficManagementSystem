import { Router } from 'express';
import * as trafficController from '../controllers/trafficController';
import * as chatbotController from '../controllers/chatbotController';
import * as videoController from '../controllers/videoController';

const router = Router();

// Traffic routes
router.get('/metrics', trafficController.getMetrics);
router.get('/violations', trafficController.getViolations);
router.get('/queue', trafficController.getQueueData);

// Chatbot routes
router.post('/chat/message', chatbotController.sendMessage);
router.get('/chat/history', chatbotController.getChatHistory);

// Video routes
router.post('/video/upload', videoController.uploadVideo);
router.get('/video/:videoId/status', videoController.getUploadStatus);
router.get('/video/:videoId/analysis', videoController.getAnalysisResults);
router.get('/videos', videoController.getUploadedVideos);

export default router;
