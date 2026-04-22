// Helper to get consistent ID from MongoDB documents
// MongoDB uses _id, but our toJSON transforms add id too
export const getId = (obj) => {
  if (!obj) return null;
  if (typeof obj === 'string') return obj;
  return obj._id || obj.id || null;
};

// Compare two IDs (handles both _id and id)
export const isSameId = (id1, id2) => {
  const a = typeof id1 === 'object' ? (id1?._id || id1?.id) : id1;
  const b = typeof id2 === 'object' ? (id2?._id || id2?.id) : id2;
  if (!a || !b) return false;
  return String(a) === String(b);
};
