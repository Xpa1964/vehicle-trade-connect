
export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  rating: number; // 1-5 stars
  comment: string;
  date: string;
  verified: boolean;
  transactionType?: 'purchase' | 'exchange' | 'service' | 'other';
  transactionId?: string;
}

export interface UserRating {
  userId: string;
  userName: string;
  averageRating: number;
  totalRatings: number;
  verifiedRatings: number;
  ratings: Rating[];
}
