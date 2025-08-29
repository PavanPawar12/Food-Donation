import { asyncHandler } from '../middleware/errorHandler.js';
import User from '../models/User.js';
import Donation from '../models/Donation.js';
import Request from '../models/Request.js';

// @desc    Get global platform stats
// @route   GET /api/stats
// @access  Public
export const getPlatformStats = asyncHandler(async (req, res) => {
  const [donorsCount, acceptancesCount, activeDonationsCount, pendingRequestsCount] = await Promise.all([
    User.countDocuments({ userType: 'donor', isActive: true }),
    Donation.countDocuments({ status: 'claimed' }),
    Donation.countDocuments({ status: 'available' }),
    Request.countDocuments({ status: 'pending' })
  ]);

  res.json({
    success: true,
    data: {
      donorsCount: donorsCount || 0,
      acceptancesCount: acceptancesCount || 0,
      activeDonationsCount: activeDonationsCount || 0,
      pendingRequestsCount: pendingRequestsCount || 0
    }
  });
});


