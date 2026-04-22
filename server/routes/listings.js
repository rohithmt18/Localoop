const express = require('express');
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');
const Community = require('../models/Community');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/listings
// @desc    Create a new listing
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, price, category, intent, condition, communityId, image } = req.body;

    const listing = new Listing({
      title,
      description,
      price: price || null,
      category: category || 'Other',
      intent: intent || 'sell',
      condition: condition || '',
      userId: req.userId,
      communityId,
      image: image || null,
    });

    await listing.save();

    // Notify community members
    const community = await Community.findById(communityId);
    if (community) {
      const notifications = community.members
        .filter(memberId => memberId.toString() !== req.userId.toString())
        .map(memberId => ({
          userId: memberId,
          type: 'listing',
          title: 'New listing in your community',
          message: `${req.user.name} posted "${listing.title}"`,
        }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(201).json({ success: true, listing: listing.toJSON() });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/listings/community/:communityId
// @desc    Get listings for a community
// @access  Private
router.get('/community/:communityId', auth, async (req, res) => {
  try {
    const { search, intent, category, status, sort, minPrice, maxPrice } = req.query;

    let query = { communityId: req.params.communityId };

    // Filters
    if (intent && intent !== 'all') query.intent = intent;
    if (category && category !== 'all') query.category = category;
    if (status && status !== 'all') query.status = status;
    if (minPrice) query.price = { ...query.price, $gte: parseInt(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseInt(maxPrice) };

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort
    let sortOption = { createdAt: -1 }; // Default: newest
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { views: -1 };

    const listings = await Listing.find(query)
      .sort(sortOption)
      .populate('userId', 'name email apartment rating ratingCount trustScore verified');

    res.json({ success: true, listings });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/listings/:id
// @desc    Get listing by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('userId', 'name email apartment phone rating ratingCount trustScore verified bio');

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update listing
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updates = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.json({ success: true, listing: updatedListing.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete listing
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/listings/user/:userId
// @desc    Get listings by user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const listings = await Listing.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
