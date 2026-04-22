const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Community name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  location: {
    type: String,
    default: '',
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
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

module.exports = mongoose.model('Community', communitySchema);
