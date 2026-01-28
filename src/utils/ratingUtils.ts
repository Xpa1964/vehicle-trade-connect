
import { Rating, UserRating } from '@/types/rating';

// Mock data for user ratings
const mockRatings: Record<string, Rating[]> = {
  '1': [
    {
      id: '1',
      fromUserId: '2',
      toUserId: '1',
      rating: 4.5,
      comment: 'Excelente trato, muy profesional y atento. La transacción fue rápida y sin problemas.',
      date: '2025-04-10T14:30:00',
      verified: true,
      transactionType: 'exchange'
    },
    {
      id: '2',
      fromUserId: '3',
      toUserId: '1',
      rating: 5,
      comment: 'Totalmente recomendable, muy claro en las explicaciones y paciente con todas mis dudas.',
      date: '2025-03-15T11:20:00',
      verified: true,
      transactionType: 'purchase'
    }
  ],
  '2': [
    {
      id: '3',
      fromUserId: '1',
      toUserId: '2',
      rating: 4,
      comment: 'Buen profesional, cumplió con todo lo acordado. Repetiría sin duda.',
      date: '2025-03-05T09:45:00',
      verified: true,
      transactionType: 'service'
    }
  ]
};

// Mock user data - export for reusability
export const mockUsers: Record<string, { name: string }> = {
  '1': { name: 'Admin User' },
  '2': { name: 'Regular User' },
  '3': { name: 'Carmen Rodríguez' }
};

// Calculate average rating for a user
export const calculateAverageRating = (ratings: Rating[]): number => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return sum / ratings.length;
};

// Count verified ratings
export const countVerifiedRatings = (ratings: Rating[]): number => {
  return ratings.filter(rating => rating.verified).length;
};

// Get user rating data
export const getUserRating = (userId: string): UserRating => {
  const ratings = mockRatings[userId] || [];
  return {
    userId,
    userName: mockUsers[userId]?.name || 'Usuario desconocido',
    averageRating: calculateAverageRating(ratings),
    totalRatings: ratings.length,
    verifiedRatings: countVerifiedRatings(ratings),
    ratings
  };
};

// Add a new rating
export const addRating = (rating: Omit<Rating, 'id' | 'date' | 'verified'>): Rating => {
  const newRating: Rating = {
    ...rating,
    id: Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString(),
    verified: false // Ratings start as unverified
  };
  
  if (!mockRatings[rating.toUserId]) {
    mockRatings[rating.toUserId] = [];
  }
  
  mockRatings[rating.toUserId].push(newRating);
  return newRating;
};
