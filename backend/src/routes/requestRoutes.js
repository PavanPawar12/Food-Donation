import express from 'express';
import {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  cancelRequest,
  getMyRequests,
  getUrgentRequests,
  getNearbyRequests,
  getRequestStats
} from '../controllers/requestController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getRequests);
router.get('/:id', getRequest);
router.get('/urgent', getUrgentRequests);
router.get('/nearby', getNearbyRequests);

// Protected routes
router.use(protect);

// NGO routes
router.post('/', restrictTo('ngo'), createRequest);
router.put('/:id', restrictTo('ngo'), updateRequest);
router.delete('/:id', restrictTo('ngo'), deleteRequest);
router.post('/:id/cancel', restrictTo('ngo'), cancelRequest);
router.get('/my-requests', restrictTo('ngo'), getMyRequests);
router.get('/stats', restrictTo('ngo'), getRequestStats);

export default router;
