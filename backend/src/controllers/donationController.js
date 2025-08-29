import Donation from '../models/Donation.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private (Donors only)
export const createDonation = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    foodType,
    quantity,
    allergens,
    dietaryRestrictions,
    preparationTime,
    expiryTime,
    pickupTime,
    location,
    images,
    tags,
    isUrgent,
    estimatedValue,
    notes
  } = req.body;

  // Validate pickup time
  const pickupStart = new Date(pickupTime.start);
  const pickupEnd = new Date(pickupTime.end);
  
  if (pickupStart >= pickupEnd) {
    return res.status(400).json({
      success: false,
      message: 'Pickup end time must be after start time'
    });
  }

  // Validate expiry time
  const prepTime = new Date(preparationTime);
  const expTime = new Date(expiryTime);
  
  if (expTime <= prepTime) {
    return res.status(400).json({
      success: false,
      message: 'Expiry time must be after preparation time'
    });
  }

  // Create donation
  const donation = await Donation.create({
    donor: req.user._id,
    title,
    description,
    foodType,
    quantity,
    allergens: allergens || ['none'],
    dietaryRestrictions: dietaryRestrictions || ['none'],
    preparationTime,
    expiryTime,
    pickupTime,
    location,
    images: images || [],
    tags: tags || [],
    isUrgent: isUrgent || false,
    estimatedValue,
    notes
  });

  // Populate donor information
  await donation.populate('donor', 'name organization');

  res.status(201).json({
    success: true,
    message: 'Donation created successfully',
    data: {
      donation
    }
  });
});

// @desc    Get all donations (with filters)
// @route   GET /api/donations
// @access  Public
export const getDonations = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    foodType,
    location,
    radius = 25,
    isUrgent,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (status) filter.status = status;
  // Exclude claimed donations if requesting available by default
  if (!status || status === 'available') {
    filter.claimed = { $ne: true };
  }
  if (foodType) filter.foodType = foodType;
  if (isUrgent !== undefined) filter.isUrgent = isUrgent === 'true';

  // Location-based filtering
  if (location && location.coordinates) {
    filter['location.coordinates'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: location.coordinates
        },
        $maxDistance: radius * 1609.34 // Convert miles to meters
      }
    };
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const donations = await Donation.find(filter)
    .populate('donor', 'name organization phone')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Donation.countDocuments(filter);

  // Calculate pagination info
  const totalPages = Math.ceil(total / parseInt(limit));
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.json({
    success: true,
    data: {
      donations,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    }
  });
});

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Public
export const getDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id)
    .populate('donor', 'name organization phone address')
    .populate('claimedBy', 'name organization phone');

  if (!donation) {
    return res.status(404).json({
      success: false,
      message: 'Donation not found'
    });
  }

  res.json({
    success: true,
    data: {
      donation
    }
  });
});

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private (Donor only)
export const updateDonation = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    foodType,
    quantity,
    allergens,
    dietaryRestrictions,
    preparationTime,
    expiryTime,
    pickupTime,
    location,
    images,
    tags,
    isUrgent,
    estimatedValue,
    notes
  } = req.body;

  // Find donation and check ownership
  const donation = await Donation.findById(req.params.id);
  
  if (!donation) {
    return res.status(404).json({
      success: false,
      message: 'Donation not found'
    });
  }

  if (donation.donor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only update your own donations.'
    });
  }

  if (donation.status !== 'available') {
    return res.status(400).json({
      success: false,
      message: 'Cannot update claimed or picked up donations'
    });
  }

  // Update donation
  const updatedDonation = await Donation.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      foodType,
      quantity,
      allergens,
      dietaryRestrictions,
      preparationTime,
      expiryTime,
      pickupTime,
      location,
      images,
      tags,
      isUrgent,
      estimatedValue,
      notes
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('donor', 'name organization');

  res.json({
    success: true,
    message: 'Donation updated successfully',
    data: {
      donation: updatedDonation
    }
  });
});

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private (Donor only)
export const deleteDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  
  if (!donation) {
    return res.status(404).json({
      success: false,
      message: 'Donation not found'
    });
  }

  if (donation.donor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only delete your own donations.'
    });
  }

  if (donation.status !== 'available') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete claimed or picked up donations'
    });
  }

  await Donation.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Donation deleted successfully'
  });
});

// @desc    Claim donation
// @route   POST /api/donations/:id/claim
// @access  Private (NGOs only)
export const claimDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  
  if (!donation) {
    return res.status(404).json({
      success: false,
      message: 'Donation not found'
    });
  }

  if (!donation.isAvailable()) {
    return res.status(400).json({
      success: false,
      message: 'Donation is not available for claiming'
    });
  }

  // Check if user is an NGO
  if (req.user.userType !== 'ngo') {
    return res.status(403).json({
      success: false,
      message: 'Only NGOs can claim donations'
    });
  }

  // Claim the donation
  await donation.claim(req.user._id);

  // Update donor stats
  const donor = await User.findById(donation.donor);
  if (donor) {
    await donor.updateStats(1, donation.quantity.amount);
  }

  // Populate updated donation
  await donation.populate('donor', 'name organization');
  await donation.populate('claimedBy', 'name organization');

  res.json({
    success: true,
    message: 'Donation claimed successfully',
    data: {
      donation
    }
  });
});

// @desc    Mark donation as picked up
// @route   POST /api/donations/:id/pickup
// @access  Private (NGO only)
export const markAsPickedUp = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  
  if (!donation) {
    return res.status(404).json({
      success: false,
      message: 'Donation not found'
    });
  }

  if (donation.claimedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only mark donations you claimed as picked up.'
    });
  }

  if (donation.status !== 'claimed') {
    return res.status(400).json({
      success: false,
      message: 'Donation must be claimed before marking as picked up'
    });
  }

  // Mark as picked up
  await donation.markAsPickedUp();

  // Populate updated donation
  await donation.populate('donor', 'name organization');
  await donation.populate('claimedBy', 'name organization');

  res.json({
    success: true,
    message: 'Donation marked as picked up successfully',
    data: {
      donation
    }
  });
});

// @desc    Get user's donations
// @route   GET /api/donations/my-donations
// @access  Private
export const getMyDonations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const filter = { donor: req.user._id };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const donations = await Donation.find(filter)
    .populate('claimedBy', 'name organization')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Donation.countDocuments(filter);
  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      donations,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    }
  });
});

// @desc    Get donations claimed by current user
// @route   GET /api/donations/claimed-by-me
// @access  Private
export const getClaimedByMe = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const filter = { claimedBy: req.user._id };
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const donations = await Donation.find(filter)
    .populate('donor', 'name organization phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Donation.countDocuments(filter);
  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      donations,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    }
  });
});

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private
export const getDonationStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const stats = await Donation.aggregate([
    {
      $match: { donor: userId }
    },
    {
      $group: {
        _id: null,
        totalDonations: { $sum: 1 },
        availableDonations: {
          $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
        },
        claimedDonations: {
          $sum: { $cond: [{ $eq: ['$status', 'claimed'] }, 1, 0] }
        },
        pickedUpDonations: {
          $sum: { $cond: [{ $eq: ['$status', 'picked-up'] }, 1, 0] }
        },
        totalMeals: { $sum: '$quantity.amount' }
      }
    }
  ]);

  const monthlyStats = await Donation.aggregate([
    {
      $match: { donor: userId }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        meals: { $sum: '$quantity.amount' }
      }
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.json({
    success: true,
    data: {
      stats: stats[0] || {
        totalDonations: 0,
        availableDonations: 0,
        claimedDonations: 0,
        pickedUpDonations: 0,
        totalMeals: 0
      },
      monthlyStats
    }
  });
});
