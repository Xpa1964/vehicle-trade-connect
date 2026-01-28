
import { AppRole } from '@/types/auth';

export interface CachedRole {
  role: AppRole;
  timestamp: number;
  signature?: string; // Security: Detect tampering
}

// Configuration for role-related utilities
export const ROLE_CONFIG = {
  // Cache duration: 15 minutes for security (reduced from 24 hours)
  // Balances performance with security - short enough to prevent long-term exploitation
  CACHE_DURATION: 15 // minutes
};
