const express = require('express');
const Community = require('../models/Community');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Generate invite code
const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @route   POST /api/communities
// @desc    Create a new community
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, location } = req.body;

    const community = new Community({
      name,
      description: description || '',
      location: location || '',
      inviteCode: generateInviteCode(),
      adminId: req.userId,
      members: [req.userId],
    });

    await community.save();

    // Update user's joined communities and role
    await User.findByIdAndUpdate(req.userId, {
      $push: { joinedCommunities: community._id },
      role: 'admin',
    });

    res.status(201).json({ success: true, community: community.toJSON() });
  } catch (error) {
    console.error('Create community error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/communities/join
// @desc    Join a community using invite code
// @access  Private
router.post('/join', auth, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const community = await Community.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!community) {
      return res.status(404).json({ success: false, message: 'Invalid invite code' });
    }

    if (community.members.includes(req.userId)) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    community.members.push(req.userId);
    await community.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { joinedCommunities: community._id },
    });

    res.json({ success: true, community: community.toJSON() });
  } catch (error) {
    console.error('Join community error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/communities/my
// @desc    Get user's communities
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const communities = await Community.find({ members: req.userId });
    res.json({ success: true, communities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/communities/:id
// @desc    Get community by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).populate('members', 'name email apartment rating ratingCount trustScore verified role bio phone');
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }
    res.json({ success: true, community });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
