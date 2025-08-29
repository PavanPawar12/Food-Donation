import express from 'express';
import {
  createDonation,
  getDonations,
  getDonation,
  updateDonation,
  deleteDonation,
  claimDonation,
  markAsPickedUp,
  getMyDonations,
  getDonationStats,
  getClaimedByMe
} from '../controllers/donationController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getDonations);

// Protected routes
router.use(protect);

// Specific routes MUST be before '/:id'
router.get('/stats', restrictTo('donor'), getDonationStats);
router.get('/my-donations', restrictTo('donor'), getMyDonations);
router.get('/claimed-by-me', protect, getClaimedByMe);

// CRUD by id
router.get('/:id', getDonation);
router.post('/', restrictTo('donor'), createDonation);
router.put('/:id', restrictTo('donor'), updateDonation);
router.delete('/:id', restrictTo('donor'), deleteDonation);

// NGO actions on a donation
router.post('/:id/claim', restrictTo('ngo'), claimDonation);
router.post('/:id/pickup', restrictTo('ngo'), markAsPickedUp);

export default router;
