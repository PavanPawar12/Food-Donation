import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Request title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  foodTypes: [{
    type: String,
    enum: ['cooked', 'packaged', 'fresh', 'frozen', 'canned', 'baked', 'other']
  }],
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
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  neededBy: {
    type: Date,
    required: [true, 'Needed by date is required']
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
    deliveryInstructions: {
      type: String,
      trim: true,
      maxlength: [200, 'Delivery instructions cannot exceed 200 characters']
    }
  },
  beneficiaries: {
    count: {
      type: Number,
      required: [true, 'Beneficiary count is required'],
      min: [1, 'Beneficiary count must be at least 1']
    },
    type: {
      type: String,
      enum: ['children', 'adults', 'families', 'elderly', 'homeless', 'refugees', 'other'],
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Beneficiary description cannot exceed 200 characters']
    }
  },
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'none']
  }],
  allergens: [{
    type: String,
    enum: ['dairy', 'eggs', 'fish', 'shellfish', 'tree nuts', 'peanuts', 'wheat', 'soy', 'none']
  }],
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled', 'expired'],
    default: 'pending'
  },
  fulfilledBy: [{
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation'
    },
    fulfilledAt: {
      type: Date,
      default: Date.now
    },
    quantity: {
      amount: Number,
      unit: String
    }
  }],
  tags: [String],
  isUrgent: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  },
  contactInfo: {
    phone: String,
    email: String,
    preferredContact: {
      type: String,
      enum: ['phone', 'email', 'both'],
      default: 'email'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
requestSchema.index({ status: 1, 'location.coordinates': '2dsphere' });
requestSchema.index({ requester: 1, createdAt: -1 });
requestSchema.index({ neededBy: 1 });
requestSchema.index({ urgency: 1, status: 1 });
requestSchema.index({ isUrgent: 1, status: 1 });

// Virtual for time until needed
requestSchema.virtual('timeUntilNeeded').get(function() {
  const now = new Date();
  const needed = new Date(this.neededBy);
  const diff = needed - now;
  
  if (diff <= 0) return 'overdue';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return 'less than 1 hour';
});

// Virtual for full address
requestSchema.virtual('fullAddress').get(function() {
  if (!this.location.address) return '';
  const { street, city, state, zipCode, country } = this.location.address;
  return [street, city, state, zipCode, country].filter(Boolean).join(', ');
});

// Virtual for fulfillment percentage
requestSchema.virtual('fulfillmentPercentage').get(function() {
  if (this.fulfilledBy.length === 0) return 0;
  
  const totalRequested = this.quantity.amount;
  const totalFulfilled = this.fulfilledBy.reduce((sum, fulfillment) => {
    return sum + fulfillment.quantity.amount;
  }, 0);
  
  return Math.min(100, Math.round((totalFulfilled / totalRequested) * 100));
});

// Method to check if request is still needed
requestSchema.methods.isStillNeeded = function() {
  const now = new Date();
  return this.status === 'pending' && new Date(this.neededBy) > now;
};

// Method to fulfill request
requestSchema.methods.fulfill = function(donationId, quantity) {
  if (this.status !== 'pending') {
    throw new Error('Request is not pending');
  }
  
  this.fulfilledBy.push({
    donation: donationId,
    fulfilledAt: new Date(),
    quantity: quantity
  });
  
  // Check if request is fully fulfilled
  const totalRequested = this.quantity.amount;
  const totalFulfilled = this.fulfilledBy.reduce((sum, fulfillment) => {
    return sum + fulfillment.quantity.amount;
  }, 0);
  
  if (totalFulfilled >= totalRequested) {
    this.status = 'fulfilled';
  }
  
  return this.save();
};

// Method to cancel request
requestSchema.methods.cancel = function() {
  if (this.status !== 'pending') {
    throw new Error('Only pending requests can be cancelled');
  }
  
  this.status = 'cancelled';
  return this.save();
};

// Static method to find nearby requests
requestSchema.statics.findNearby = function(coordinates, maxDistance = 25) {
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
    status: 'pending'
  }).populate('requester', 'name organization');
};

// Static method to find urgent requests
requestSchema.statics.findUrgent = function() {
  return this.find({
    isUrgent: true,
    status: 'pending'
  }).populate('requester', 'name organization');
};

const Request = mongoose.model('Request', requestSchema);

export default Request;
