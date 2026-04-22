const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    default: null,
  },
  category: {
    type: String,
    enum: ['Electronics', 'Furniture', 'Vehicles', 'Clothing', 'Home & Kitchen', 'Books & Education', 'Sports & Fitness', 'Services', 'Food & Groceries', 'Other'],
    default: 'Other',
  },
  intent: {
    type: String,
    enum: ['sell', 'buy', 'service', 'request'],
    default: 'sell',
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'closed'],
    default: 'active',
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor', ''],
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for search functionality
listingSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
