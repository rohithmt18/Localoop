const express = require('express');
const Rating = require('../models/Rating');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/ratings
// @desc    Rate a user
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { toUserId, rating, comment } = req.body;

    if (req.userId.toString() === toUserId) {
      return res.status(400).json({ success: false, message: 'Cannot rate yourself' });
    }

    // Upsert rating
    const existingRating = await Rating.findOne({ fromUserId: req.userId, toUserId });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment || '';
      await existingRating.save();
    } else {
      await Rating.create({
        fromUserId: req.userId,
        toUserId,
        rating,
        comment: comment || '',
      });
    }

    // Recalculate average rating
    const allRatings = await Rating.find({ toUserId });
    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    const trustScore = Math.min(100, Math.round(50 + (avgRating * 5) + (allRatings.length * 2)));

    await User.findByIdAndUpdate(toUserId, {
      rating: Math.round(avgRating * 10) / 10,
      ratingCount: allRatings.length,
      trustScore,
    });

    // Send notification
    await Notification.create({
      userId: toUserId,
      type: 'rating',
      title: 'You received a new rating',
      message: `${req.user.name} rated you ${rating} star${rating !== 1 ? 's' : ''} ⭐`,
    });

    res.json({ success: true, message: 'Rating submitted' });
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/ratings/user/:userId
// @desc    Get ratings for a user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ toUserId: req.params.userId })
      .populate('fromUserId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, ratings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
