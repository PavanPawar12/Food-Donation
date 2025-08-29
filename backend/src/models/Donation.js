import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Donation title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  foodType: {
    type: String,
    required: [true, 'Food type is required'],
    enum: ['cooked', 'packaged', 'fresh', 'frozen', 'canned', 'baked', 'other']
  },
  quantity: {
    amount: {
      type: Number,
      required: [true, 'Quantity amount is required'],
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      required: [true, 'Quantity unit is required'],
      enum: ['meals', 'pounds', 'kilograms', 'pieces', 'servings', 'containers']
    }
  },
  allergens: [{
    type: String,
    enum: ['dairy', 'eggs', 'fish', 'shellfish', 'tree nuts', 'peanuts', 'wheat', 'soy', 'none']
  }],
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'none']
  }],
  preparationTime: {
    type: Date,
    required: [true, 'Preparation time is required']
  },
  expiryTime: {
    type: Date,
    required: [true, 'Expiry time is required']
  },
  pickupTime: {
    start: {
      type: Date,
      required: [true, 'Pickup start time is required']
    },
    end: {
      type: Date,
      required: [true, 'Pickup end time is required']
    }
  },
  location: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'United States'
      }
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    pickupInstructions: {
      type: String,
      trim: true,
      maxlength: [200, 'Pickup instructions cannot exceed 200 characters']
    }
  },
  images: [{
    url: String,
    caption: String
  }],
  status: {
    type: String,
    enum: ['available', 'claimed', 'picked-up', 'expired', 'cancelled'],
    default: 'available'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  claimed: {
    type: Boolean,
    default: false
  },
  claimedAt: {
    type: Date,
    default: null
  },
  pickedUpAt: {
    type: Date,
    default: null
  },
  tags: [String],
  isUrgent: {
    type: Boolean,
    default: false
  },
  estimatedValue: {
    type: Number,
    min: [0, 'Estimated value cannot be negative']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
donationSchema.index({ status: 1, 'location.coordinates': '2dsphere' });
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ expiryTime: 1 });
donationSchema.index({ isUrgent: 1, status: 1 });

// Virtual for time until expiry
donationSchema.virtual('timeUntilExpiry').get(function() {
  const now = new Date();
  const expiry = new Date(this.expiryTime);
  const diff = expiry - now;
  
  if (diff <= 0) return 'expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return 'less than 1 hour';
});

// Virtual for pickup window
donationSchema.virtual('pickupWindow').get(function() {
  const start = new Date(this.pickupTime.start);
  const end = new Date(this.pickupTime.end);
  
  const startStr = start.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  const endStr = end.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  return `${startStr} - ${endStr}`;
});

// Virtual for full address
donationSchema.virtual('fullAddress').get(function() {
  if (!this.location.address) return '';
  const { street, city, state, zipCode, country } = this.location.address;
  return [street, city, state, zipCode, country].filter(Boolean).join(', ');
});

// Method to check if donation is available
donationSchema.methods.isAvailable = function() {
  const now = new Date();
  return this.status === 'available' && 
         new Date(this.expiryTime) > now && 
         new Date(this.pickupTime.end) > now;
};

// Method to claim donation
donationSchema.methods.claim = function(userId) {
  if (!this.isAvailable()) {
    throw new Error('Donation is not available for claiming');
  }
  
  this.status = 'claimed';
  this.claimedBy = userId;
  this.claimedAt = new Date();
  this.claimed = true;
  
  return this.save();
};

// Method to mark as picked up
donationSchema.methods.markAsPickedUp = function() {
  if (this.status !== 'claimed') {
    throw new Error('Donation must be claimed before marking as picked up');
  }
  
  this.status = 'picked-up';
  this.pickedUpAt = new Date();
  
  return this.save();
};

// Static method to find nearby donations
donationSchema.statics.findNearby = function(coordinates, maxDistance = 25) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance * 1609.34 // Convert miles to meters
      }
    },
    status: 'available'
  }).populate('donor', 'name organization');
};

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
