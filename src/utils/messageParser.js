// ============================================
// SMART MESSAGE PARSER (Basic NLP)
// Converts raw text into structured listings
// ============================================

// Intent keywords mapping
const INTENT_PATTERNS = {
  sell: [
    'selling', 'sell', 'for sale', 'wts', 'want to sell',
    'available for sale', 'letting go', 'getting rid of',
    'offering', 'up for grabs', 'clearance', 'disposing'
  ],
  buy: [
    'buying', 'buy', 'wtb', 'want to buy', 'looking for',
    'looking to buy', 'need', 'searching for', 'in search of',
    'iso', 'wanted', 'anyone selling', 'where can i get',
    'does anyone have', 'any leads on'
  ],
  service: [
    'service', 'offering service', 'available for hire',
    'hire me', 'freelance', 'can help with', 'i do',
    'plumber', 'electrician', 'carpenter', 'tutor',
    'babysitter', 'cleaning', 'repair', 'fix',
    'painting', 'gardening', 'cooking', 'delivery',
    'driver', 'teacher', 'trainer', 'consultant'
  ],
  request: [
    'request', 'help needed', 'need help', 'can anyone',
    'does anyone know', 'recommend', 'suggestion',
    'advice needed', 'urgent', 'emergency', 'asap',
    'please help', 'any recommendations'
  ]
};

// Category keywords
const CATEGORY_PATTERNS = {
  'Electronics': [
    'phone', 'laptop', 'computer', 'tablet', 'ipad', 'iphone',
    'samsung', 'tv', 'television', 'monitor', 'speaker', 'headphone',
    'charger', 'camera', 'printer', 'router', 'modem', 'keyboard',
    'mouse', 'gaming', 'console', 'playstation', 'xbox', 'nintendo'
  ],
  'Furniture': [
    'sofa', 'couch', 'table', 'chair', 'desk', 'bed', 'mattress',
    'wardrobe', 'shelf', 'bookshelf', 'cabinet', 'drawer', 'lamp',
    'mirror', 'curtain', 'rug', 'carpet', 'bean bag', 'stool'
  ],
  'Vehicles': [
    'car', 'bike', 'bicycle', 'scooter', 'motorcycle', 'vehicle',
    'auto', 'van', 'truck', 'mileage', 'petrol', 'diesel', 'ev'
  ],
  'Clothing': [
    'clothes', 'shirt', 'pant', 'dress', 'shoes', 'jacket',
    'saree', 'kurta', 'jeans', 'tops', 'sneakers', 'boots',
    'bag', 'handbag', 'watch', 'jewellery', 'jewelry', 'accessory'
  ],
  'Home & Kitchen': [
    'kitchen', 'utensil', 'cookware', 'microwave', 'oven', 'fridge',
    'refrigerator', 'washing machine', 'blender', 'mixer', 'grinder',
    'pan', 'pot', 'plate', 'glass', 'container', 'bottle'
  ],
  'Books & Education': [
    'book', 'textbook', 'novel', 'study', 'material', 'notes',
    'guide', 'reference', 'magazine', 'newspaper', 'course'
  ],
  'Sports & Fitness': [
    'gym', 'fitness', 'sport', 'cricket', 'football', 'badminton',
    'tennis', 'yoga', 'mat', 'dumbbell', 'treadmill', 'cycle'
  ],
  'Services': [
    'plumbing', 'electrical', 'carpentry', 'painting', 'cleaning',
    'tutoring', 'teaching', 'repair', 'maintenance', 'delivery',
    'driving', 'cooking', 'gardening', 'pest control', 'laundry'
  ],
  'Food & Groceries': [
    'food', 'grocery', 'homemade', 'tiffin', 'meal', 'snack',
    'baked', 'cake', 'sweet', 'pickle', 'organic', 'fresh',
    'vegetable', 'fruit'
  ],
  'Other': []
};

// Price extraction regex patterns
const PRICE_PATTERNS = [
  /(?:rs\.?|inr|₹)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+)/i,
  /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+)\s*(?:rs\.?|inr|₹|rupees?)/i,
  /(?:price|cost|rate|amount|for|at|only)\s*[:=]?\s*(?:rs\.?|inr|₹)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+)/i,
  /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+)/i,
  /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+)\s*(?:dollars?|\$)/i,
];

// Condition patterns
const CONDITION_PATTERNS = {
  'New': ['new', 'brand new', 'sealed', 'unopened', 'unused', 'fresh', 'mint'],
  'Like New': ['like new', 'barely used', 'almost new', 'excellent condition'],
  'Good': ['good condition', 'well maintained', 'working perfectly', 'good shape'],
  'Fair': ['fair condition', 'used', 'decent', 'okay condition', 'working'],
  'Poor': ['poor condition', 'needs repair', 'damaged', 'broken', 'not working'],
};

/**
 * Parse raw text into a structured listing
 * @param {string} text - Raw message text
 * @returns {Object} Structured listing data
 */
export const parseMessage = (text) => {
  const lowerText = text.toLowerCase().trim();
  
  const result = {
    originalText: text,
    intent: detectIntent(lowerText),
    category: detectCategory(lowerText),
    price: extractPrice(text),
    condition: detectCondition(lowerText),
    title: generateTitle(text, lowerText),
    description: text.trim(),
    confidence: 0,
    parsedFields: [],
  };
  
  // Calculate confidence
  let confidence = 0;
  if (result.intent !== 'unknown') { confidence += 30; result.parsedFields.push('intent'); }
  if (result.category !== 'Other') { confidence += 25; result.parsedFields.push('category'); }
  if (result.price !== null) { confidence += 25; result.parsedFields.push('price'); }
  if (result.condition !== null) { confidence += 20; result.parsedFields.push('condition'); }
  result.confidence = Math.min(confidence, 100);
  
  return result;
};

function detectIntent(text) {
  let bestIntent = 'unknown';
  let bestScore = 0;
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        const score = pattern.length; // Longer matches are more specific
        if (score > bestScore) {
          bestScore = score;
          bestIntent = intent;
        }
      }
    }
  }
  
  return bestIntent;
}

function detectCategory(text) {
  let bestCategory = 'Other';
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(CATEGORY_PATTERNS)) {
    if (category === 'Other') continue;
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

function extractPrice(text) {
  for (const pattern of PRICE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const price = parseInt(match[1].replace(/,/g, ''), 10);
      if (price > 0 && price < 10000000) { // Sanity check
        return price;
      }
    }
  }
  return null;
}

function detectCondition(text) {
  for (const [condition, patterns] of Object.entries(CONDITION_PATTERNS)) {
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        return condition;
      }
    }
  }
  return null;
}

function generateTitle(originalText, lowerText) {
  // Remove price info and common words to generate a clean title
  let title = originalText
    .replace(/(?:rs\.?|inr|₹|\$)\s*\d[\d,.]*/gi, '')
    .replace(/\d[\d,.]*\s*(?:rs\.?|inr|₹|rupees?|dollars?|\$)/gi, '')
    .replace(/(?:price|cost|rate|amount|for|at|only)\s*[:=]?\s*\d[\d,.]*/gi, '')
    .trim();
  
  // Remove intent words from beginning
  const allIntentWords = Object.values(INTENT_PATTERNS).flat();
  for (const word of allIntentWords) {
    const regex = new RegExp(`^${word}\\s*[:,-]?\\s*`, 'i');
    title = title.replace(regex, '');
  }
  
  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);
  
  // Truncate if too long
  if (title.length > 80) {
    title = title.substring(0, 77) + '...';
  }
  
  return title || 'Untitled Listing';
}

export default parseMessage;
