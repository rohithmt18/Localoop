// ============================================
// DATABASE SEED SCRIPT
// Run: node seed.js
// ============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Community = require('./models/Community');
const Listing = require('./models/Listing');
const Notification = require('./models/Notification');
const Rating = require('./models/Rating');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Community.deleteMany({});
    await Listing.deleteMany({});
    await Notification.deleteMany({});
    await Rating.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users (password will be hashed by the pre-save hook)
    const users = await User.create([
      {
        name: 'Priya Sharma',
        email: 'priya@demo.com',
        password: 'demo123',
        role: 'admin',
        rating: 4.8,
        ratingCount: 23,
        trustScore: 92,
        verified: true,
        phone: '9876543210',
        apartment: 'A-401',
        bio: 'Community manager & avid gardener. Love helping neighbors!',
      },
      {
        name: 'Rahul Mehta',
        email: 'rahul@demo.com',
        password: 'demo123',
        role: 'member',
        rating: 4.5,
        ratingCount: 15,
        trustScore: 85,
        verified: true,
        phone: '9876543211',
        apartment: 'B-202',
        bio: 'Tech enthusiast. Always looking for good deals on gadgets.',
      },
      {
        name: 'Ananya Patel',
        email: 'ananya@demo.com',
        password: 'demo123',
        role: 'member',
        rating: 4.9,
        ratingCount: 31,
        trustScore: 96,
        verified: true,
        phone: '9876543212',
        apartment: 'C-105',
        bio: 'Home baker & craft lover. Order my cakes and cookies!',
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@demo.com',
        password: 'demo123',
        role: 'member',
        rating: 4.2,
        ratingCount: 8,
        trustScore: 72,
        verified: true,
        phone: '9876543213',
        apartment: 'D-303',
        bio: 'Freelance plumber and electrician. Available on weekends.',
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@demo.com',
        password: 'demo123',
        role: 'member',
        rating: 4.6,
        ratingCount: 12,
        trustScore: 81,
        verified: false,
        phone: '9876543214',
        apartment: 'A-102',
        bio: 'Book lover. Always have extra books to share or swap!',
      },
    ]);

    console.log(`👥 Created ${users.length} users`);

    // Create community
    const community = await Community.create({
      name: 'Sunrise Apartments',
      description: 'Community marketplace for Sunrise Apartments residents. Buy, sell, request services from your neighbors!',
      inviteCode: 'SUNRISE1',
      adminId: users[0]._id,
      members: users.map(u => u._id),
      location: 'Bangalore, India',
    });

    // Update users with community reference
    await User.updateMany(
      { _id: { $in: users.map(u => u._id) } },
      { $push: { joinedCommunities: community._id } }
    );

    console.log(`🏘️  Created community: ${community.name}`);

    // Create listings
    const listings = await Listing.create([
      {
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Selling my Samsung Galaxy S24 Ultra. 256GB, Titanium Black. Comes with original box, charger, and cover. No scratches. 8 months old. Reason for selling: upgrading.',
        price: 65000,
        category: 'Electronics',
        intent: 'sell',
        status: 'active',
        condition: 'Like New',
        userId: users[1]._id,
        communityId: community._id,
        views: 45,
      },
      {
        title: 'Homemade Chocolate Cake',
        description: 'Taking orders for homemade chocolate cakes! ₹800 for 1 kg. Eggless options available. Need 2 days advance notice. Made with premium Belgian chocolate.',
        price: 800,
        category: 'Food & Groceries',
        intent: 'sell',
        status: 'active',
        condition: 'New',
        userId: users[2]._id,
        communityId: community._id,
        views: 78,
      },
      {
        title: 'IKEA Study Desk',
        description: 'Looking to buy a study desk, preferably IKEA MALM or similar. Budget around ₹5000-8000. Need it for my home office setup. White color preferred.',
        price: 7000,
        category: 'Furniture',
        intent: 'buy',
        status: 'active',
        userId: users[4]._id,
        communityId: community._id,
        views: 22,
      },
      {
        title: 'Plumbing Services Available',
        description: 'Professional plumbing services available on weekends. Pipe fitting, leak repair, tap installation, bathroom fittings. Reasonable rates. 10+ years experience.',
        price: 500,
        category: 'Services',
        intent: 'service',
        status: 'active',
        userId: users[3]._id,
        communityId: community._id,
        views: 56,
      },
      {
        title: "Children's Book Collection",
        description: "Selling a collection of 15 children's books. Includes Harry Potter set, Diary of a Wimpy Kid, and more. Great for kids aged 8-14.",
        price: 2500,
        category: 'Books & Education',
        intent: 'sell',
        status: 'active',
        condition: 'Good',
        userId: users[4]._id,
        communityId: community._id,
        views: 34,
      },
      {
        title: 'Yoga Mat & Dumbbells Set',
        description: 'Selling yoga mat (6mm thick, anti-skid) and a pair of 5kg dumbbells. Barely used - bought during lockdown.',
        price: 1200,
        category: 'Sports & Fitness',
        intent: 'sell',
        status: 'active',
        condition: 'Like New',
        userId: users[3]._id,
        communityId: community._id,
        views: 19,
      },
      {
        title: 'Need Electrician Urgently',
        description: 'Need an electrician urgently! Main switch board issue in my flat. Power fluctuating. Anyone know a reliable electrician?',
        category: 'Services',
        intent: 'request',
        status: 'active',
        userId: users[0]._id,
        communityId: community._id,
        views: 67,
      },
      {
        title: 'Washing Machine - Samsung 7kg',
        description: 'Samsung 7kg fully automatic washing machine. 3 years old but works perfectly. Moving out, need to sell quickly. Price negotiable.',
        price: 12000,
        category: 'Home & Kitchen',
        intent: 'sell',
        status: 'sold',
        condition: 'Good',
        userId: users[1]._id,
        communityId: community._id,
        views: 92,
      },
    ]);

    console.log(`🛒 Created ${listings.length} listings`);

    // Create notifications
    await Notification.create([
      {
        userId: users[0]._id,
        type: 'listing',
        title: 'New listing in your community',
        message: 'Rahul Mehta posted "Samsung Galaxy S24 Ultra" for sale',
        read: false,
      },
      {
        userId: users[0]._id,
        type: 'rating',
        title: 'You received a new rating',
        message: 'Ananya Patel rated you 5 stars ⭐',
        read: false,
      },
      {
        userId: users[0]._id,
        type: 'community',
        title: 'New member joined',
        message: 'Sneha Reddy joined Sunrise Apartments',
        read: true,
      },
    ]);

    console.log('🔔 Created notifications');

    // Create ratings
    await Rating.create([
      { fromUserId: users[2]._id, toUserId: users[0]._id, rating: 5, comment: 'Very helpful! Solved my issue quickly.' },
      { fromUserId: users[0]._id, toUserId: users[2]._id, rating: 5, comment: 'Best cakes in the building!' },
      { fromUserId: users[4]._id, toUserId: users[1]._id, rating: 4, comment: 'Good deal on the phone. Smooth transaction.' },
    ]);

    console.log('⭐ Created ratings');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('   Email: priya@demo.com  |  Password: demo123  (Admin)');
    console.log('   Email: rahul@demo.com  |  Password: demo123');
    console.log('   Email: ananya@demo.com |  Password: demo123');
    console.log('   Email: vikram@demo.com |  Password: demo123');
    console.log('   Email: sneha@demo.com  |  Password: demo123');
    console.log('\n🏘️  Community Invite Code: SUNRISE1\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
