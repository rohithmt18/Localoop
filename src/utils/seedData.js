// ============================================
// SEED DATA - Demo data for Localoop
// ============================================

import { generateId } from './storage';

const demoUserId1 = 'demo_user_1';
const demoUserId2 = 'demo_user_2';
const demoUserId3 = 'demo_user_3';
const demoUserId4 = 'demo_user_4';
const demoUserId5 = 'demo_user_5';
const demoCommunityId = 'demo_community_1';

export const SEED_USERS = [
  {
    id: demoUserId1,
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
    joinedCommunities: [demoCommunityId],
    createdAt: '2025-12-01T10:00:00Z',
    bio: 'Community manager & avid gardener. Love helping neighbors!',
    avatar: null,
  },
  {
    id: demoUserId2,
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
    joinedCommunities: [demoCommunityId],
    createdAt: '2025-12-05T14:00:00Z',
    bio: 'Tech enthusiast. Always looking for good deals on gadgets.',
    avatar: null,
  },
  {
    id: demoUserId3,
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
    joinedCommunities: [demoCommunityId],
    createdAt: '2025-12-10T09:00:00Z',
    bio: 'Home baker & craft lover. Order my cakes and cookies!',
    avatar: null,
  },
  {
    id: demoUserId4,
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
    joinedCommunities: [demoCommunityId],
    createdAt: '2026-01-02T11:00:00Z',
    bio: 'Freelance plumber and electrician. Available on weekends.',
    avatar: null,
  },
  {
    id: demoUserId5,
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
    joinedCommunities: [demoCommunityId],
    createdAt: '2026-01-15T16:00:00Z',
    bio: 'Book lover. Always have extra books to share or swap!',
    avatar: null,
  }
];

export const SEED_COMMUNITIES = [
  {
    id: demoCommunityId,
    name: 'Sunrise Apartments',
    description: 'Community marketplace for Sunrise Apartments residents. Buy, sell, request services from your neighbors!',
    inviteCode: 'SUNRISE1',
    adminId: demoUserId1,
    members: [demoUserId1, demoUserId2, demoUserId3, demoUserId4, demoUserId5],
    location: 'Bangalore, India',
    createdAt: '2025-12-01T10:00:00Z',
  }
];

export const SEED_LISTINGS = [
  {
    id: generateId(),
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Selling my Samsung Galaxy S24 Ultra. 256GB, Titanium Black. Comes with original box, charger, and cover. No scratches. 8 months old. Reason for selling: upgrading.',
    price: 65000,
    category: 'Electronics',
    intent: 'sell',
    status: 'active',
    condition: 'Like New',
    userId: demoUserId2,
    communityId: demoCommunityId,
    views: 45,
    image: null,
    createdAt: '2026-04-20T10:30:00Z',
  },
  {
    id: generateId(),
    title: 'Homemade Chocolate Cake',
    description: 'Taking orders for homemade chocolate cakes! ₹800 for 1 kg. Eggless options available. Need 2 days advance notice. Made with premium Belgian chocolate.',
    price: 800,
    category: 'Food & Groceries',
    intent: 'sell',
    status: 'active',
    condition: 'New',
    userId: demoUserId3,
    communityId: demoCommunityId,
    views: 78,
    image: null,
    createdAt: '2026-04-19T14:00:00Z',
  },
  {
    id: generateId(),
    title: 'IKEA Study Desk',
    description: 'Looking to buy a study desk, preferably IKEA MALM or similar. Budget around ₹5000-8000. Need it for my home office setup. White color preferred.',
    price: 7000,
    category: 'Furniture',
    intent: 'buy',
    status: 'active',
    condition: null,
    userId: demoUserId5,
    communityId: demoCommunityId,
    views: 22,
    image: null,
    createdAt: '2026-04-18T09:00:00Z',
  },
  {
    id: generateId(),
    title: 'Plumbing Services Available',
    description: 'Professional plumbing services available on weekends. Pipe fitting, leak repair, tap installation, bathroom fittings. Reasonable rates. 10+ years experience. Call or message for quotes.',
    price: 500,
    category: 'Services',
    intent: 'service',
    status: 'active',
    condition: null,
    userId: demoUserId4,
    communityId: demoCommunityId,
    views: 56,
    image: null,
    createdAt: '2026-04-17T11:00:00Z',
  },
  {
    id: generateId(),
    title: 'Children\'s Book Collection',
    description: 'Selling a collection of 15 children\'s books. Includes Harry Potter set, Diary of a Wimpy Kid, and more. Great for kids aged 8-14. Selling as a lot, not individually.',
    price: 2500,
    category: 'Books & Education',
    intent: 'sell',
    status: 'active',
    condition: 'Good',
    userId: demoUserId5,
    communityId: demoCommunityId,
    views: 34,
    image: null,
    createdAt: '2026-04-16T15:30:00Z',
  },
  {
    id: generateId(),
    title: 'Yoga Mat & Dumbbells Set',
    description: 'Selling yoga mat (6mm thick, anti-skid) and a pair of 5kg dumbbells. Barely used - bought during lockdown. Collect from D block lobby.',
    price: 1200,
    category: 'Sports & Fitness',
    intent: 'sell',
    status: 'active',
    condition: 'Like New',
    userId: demoUserId4,
    communityId: demoCommunityId,
    views: 19,
    image: null,
    createdAt: '2026-04-15T08:00:00Z',
  },
  {
    id: generateId(),
    title: 'Need Electrician Urgently',
    description: 'Need an electrician urgently! Main switch board issue in my flat. Power fluctuating. Anyone know a reliable electrician or can help?',
    price: null,
    category: 'Services',
    intent: 'request',
    status: 'active',
    condition: null,
    userId: demoUserId1,
    communityId: demoCommunityId,
    views: 67,
    image: null,
    createdAt: '2026-04-14T19:00:00Z',
  },
  {
    id: generateId(),
    title: 'Washing Machine - Samsung 7kg',
    description: 'Samsung 7kg fully automatic washing machine. 3 years old but works perfectly. Moving out of the city, so need to sell quickly. Price negotiable for quick sale.',
    price: 12000,
    category: 'Home & Kitchen',
    intent: 'sell',
    status: 'sold',
    condition: 'Good',
    userId: demoUserId2,
    communityId: demoCommunityId,
    views: 92,
    image: null,
    createdAt: '2026-04-10T12:00:00Z',
  },
];

export const SEED_NOTIFICATIONS = [
  {
    id: generateId(),
    userId: demoUserId1,
    type: 'listing',
    title: 'New listing in your community',
    message: 'Rahul Mehta posted "Samsung Galaxy S24 Ultra" for sale',
    read: false,
    createdAt: '2026-04-20T10:30:00Z',
  },
  {
    id: generateId(),
    userId: demoUserId1,
    type: 'rating',
    title: 'You received a new rating',
    message: 'Ananya Patel rated you 5 stars ⭐',
    read: false,
    createdAt: '2026-04-19T16:00:00Z',
  },
  {
    id: generateId(),
    userId: demoUserId1,
    type: 'community',
    title: 'New member joined',
    message: 'Sneha Reddy joined Sunrise Apartments',
    read: true,
    createdAt: '2026-01-15T16:00:00Z',
  },
];

export const SEED_RATINGS = [
  {
    id: generateId(),
    fromUserId: demoUserId3,
    toUserId: demoUserId1,
    rating: 5,
    comment: 'Very helpful! Solved my issue quickly.',
    createdAt: '2026-04-19T16:00:00Z',
  },
  {
    id: generateId(),
    fromUserId: demoUserId1,
    toUserId: demoUserId3,
    rating: 5,
    comment: 'Best cakes in the building! Highly recommend.',
    createdAt: '2026-04-18T10:00:00Z',
  },
  {
    id: generateId(),
    fromUserId: demoUserId5,
    toUserId: demoUserId2,
    rating: 4,
    comment: 'Good deal on the phone. Quick and smooth transaction.',
    createdAt: '2026-04-15T12:00:00Z',
  },
];

export const initializeSeedData = () => {
  const existingUsers = localStorage.getItem('localoop_users');
  if (existingUsers) return false; // Already initialized
  
  localStorage.setItem('localoop_users', JSON.stringify(SEED_USERS));
  localStorage.setItem('localoop_communities', JSON.stringify(SEED_COMMUNITIES));
  localStorage.setItem('localoop_listings', JSON.stringify(SEED_LISTINGS));
  localStorage.setItem('localoop_notifications', JSON.stringify(SEED_NOTIFICATIONS));
  localStorage.setItem('localoop_ratings', JSON.stringify(SEED_RATINGS));
  
  return true;
};
