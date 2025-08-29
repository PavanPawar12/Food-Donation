import Request from '../models/Request.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Create new request
// @route   POST /api/requests
// @access  Private (NGOs only)
export const createRequest = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    foodTypes,
    quantity,
    urgency,
    neededBy,
    location,
    beneficiaries,
    dietaryRestrictions,
    allergens,
    tags,
    isUrgent,
    notes,
    contactInfo
  } = req.body;

  // Validate needed by date
  const neededDate = new Date(neededBy);
  const now = new Date();
  
  if (neededDate <= now) {
    return res.status(400).json({
      success: false,
      message: 'Needed by date must be in the future'
    });
  }

  // Check if user is an NGO
  if (req.user.userType !== 'ngo') {
    return res.status(403).json({
      success: false,
      message: 'Only NGOs can create food requests'
    });
  }

  // Create request
  const request = await Request.create({
    requester: req.user._id,
    title,
    description,
    foodTypes: foodTypes || ['other'],
    quantity,
    urgency: urgency || 'medium',
    neededBy,
    location,
    beneficiaries,
    dietaryRestrictions: dietaryRestrictions || ['none'],
    allergens: allergens || ['none'],
    tags: tags || [],
    isUrgent: isUrgent || false,
    notes,
    contactInfo: {
      ...contactInfo,
      email: contactInfo?.email || req.user.email,
      phone: contactInfo?.phone || req.user.phone
    }
  });

  // Populate requester information
  await request.populate('requester', 'name organization');

  res.status(201).json({
    success: true,
    message: 'Food request created successfully',
    data: {
      request
    }
  });
});

// @desc    Get all requests (with filters)
// @route   GET /api/requests
// @access  Public
export const getRequests = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    urgency,
    location,
    radius = 25,
    isUrgent,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (status) filter.status = status;
  if (urgency) filter.urgency = urgency;
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
  const requests = await Request.find(filter)
    .populate('requester', 'name organization')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Request.countDocuments(filter);

  // Calculate pagination info
  const totalPages = Math.ceil(total / parseInt(limit));
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.json({
    success: true,
    data: {
      requests,
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

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Public
export const getRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id)
    .populate('requester', 'name organization phone address')
    .populate('fulfilledBy.donation', 'title description quantity');

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Request not found'
    });
  }

  res.json({
    success: true,
    data: {
      request
    }
  });
});

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private (Requester only)
export const updateRequest = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    foodTypes,
    quantity,
    urgency,
    neededBy,
    location,
    beneficiaries,
    dietaryRestrictions,
    allergens,
    tags,
    isUrgent,
    notes,
    contactInfo
  } = req.body;

  // Find request and check ownership
  const request = await Request.findById(req.params.id);
  
  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Request not found'
    });
  }

  if (request.requester.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only update your own requests.'
    });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Cannot update fulfilled or cancelled requests'
    });
  }

  // Update request
  const updatedRequest = await Request.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      foodTypes,
      quantity,
      urgency,
      neededBy,
      location,
      beneficiaries,
      dietaryRestrictions,
      allergens,
      tags,
      isUrgent,
      notes,
      contactInfo
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('requester', 'name organization');

  res.json({
    success: true,
    message: 'Request updated successfully',
    data: {
      request: updatedRequest
    }
  });
});

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Requester only)
export const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  
  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Request not found'
    });
  }

  if (request.requester.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only delete your own requests.'
    });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete fulfilled or cancelled requests'
    });
  }

  await Request.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Request deleted successfully'
  });
});

// @desc    Cancel request
// @route   POST /api/requests/:id/cancel
// @access  Private (Requester only)
export const cancelRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  
  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Request not found'
    });
  }

  if (request.requester.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only cancel your own requests.'
    });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Only pending requests can be cancelled'
    });
  }

  // Cancel the request
  await request.cancel();

  // Populate updated request
  await request.populate('requester', 'name organization');

  res.json({
    success: true,
    message: 'Request cancelled successfully',
    data: {
      request
    }
  });
});

// @desc    Get user's requests
// @route   GET /api/requests/my-requests
// @access  Private
export const getMyRequests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const filter = { requester: req.user._id };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const requests = await Request.find(filter)
    .populate('fulfilledBy.donation', 'title description quantity')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Request.countDocuments(filter);
  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    }
  });
});

// @desc    Get urgent requests
// @route   GET /api/requests/urgent
// @access  Public
export const getUrgentRequests = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const requests = await Request.find({
    isUrgent: true,
    status: 'pending'
  })
    .populate('requester', 'name organization')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: {
      requests,
      count: requests.length
    }
  });
});

// @desc    Get nearby requests
// @route   GET /api/requests/nearby
// @access  Public
export const getNearbyRequests = asyncHandler(async (req, res) => {
  const { coordinates, maxDistance = 25, limit = 20 } = req.query;

  if (!coordinates) {
    return res.status(400).json({
      success: false,
      message: 'Coordinates are required for nearby search'
    });
  }

  const requests = await Request.findNearby(
    coordinates.split(',').map(Number),
    maxDistance
  ).limit(parseInt(limit));

  res.json({
    success: true,
    data: {
      requests,
      count: requests.length,
      maxDistance: parseInt(maxDistance)
    }
  });
});

// @desc    Get request statistics
// @route   GET /api/requests/stats
// @access  Private
export const getRequestStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const stats = await Request.aggregate([
    {
      $match: { requester: userId }
    },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        pendingRequests: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        fulfilledRequests: {
          $sum: { $cond: [{ $eq: ['$status', 'fulfilled'] }, 1, 0] }
        },
        cancelledRequests: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        totalBeneficiaries: { $sum: '$beneficiaries.count' }
      }
    }
  ]);

  const urgencyStats = await Request.aggregate([
    {
      $match: { requester: userId }
    },
    {
      $group: {
        _id: '$urgency',
        count: { $sum: 1 }
      }
    }
  ]);

  const monthlyStats = await Request.aggregate([
    {
      $match: { requester: userId }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        beneficiaries: { $sum: '$beneficiaries.count' }
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
        totalRequests: 0,
        pendingRequests: 0,
        fulfilledRequests: 0,
        cancelledRequests: 0,
        totalBeneficiaries: 0
      },
      urgencyStats,
      monthlyStats
    }
  });
});
