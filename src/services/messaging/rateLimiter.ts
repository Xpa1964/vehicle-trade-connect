
export interface RateLimitConfig {
  maxPerMinute: number;
  maxPerHour: number;
  maxPerDay: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  reason?: string;
}

class RateLimiter {
  private userLimits = new Map<string, { 
    minute: { count: number; resetTime: Date },
    hour: { count: number; resetTime: Date },
    day: { count: number; resetTime: Date }
  }>();

  private defaultLimits: RateLimitConfig = {
    maxPerMinute: 10,
    maxPerHour: 100,
    maxPerDay: 500
  };

  checkLimit(userId: string, config?: Partial<RateLimitConfig>): RateLimitResult {
    const limits = { ...this.defaultLimits, ...config };
    const now = new Date();
    
    // Get or create user limits
    let userLimit = this.userLimits.get(userId);
    if (!userLimit) {
      userLimit = {
        minute: { count: 0, resetTime: new Date(now.getTime() + 60000) },
        hour: { count: 0, resetTime: new Date(now.getTime() + 3600000) },
        day: { count: 0, resetTime: new Date(now.getTime() + 86400000) }
      };
      this.userLimits.set(userId, userLimit);
    }

    // Reset counters if time has passed
    if (now > userLimit.minute.resetTime) {
      userLimit.minute = { count: 0, resetTime: new Date(now.getTime() + 60000) };
    }
    if (now > userLimit.hour.resetTime) {
      userLimit.hour = { count: 0, resetTime: new Date(now.getTime() + 3600000) };
    }
    if (now > userLimit.day.resetTime) {
      userLimit.day = { count: 0, resetTime: new Date(now.getTime() + 86400000) };
    }

    // Check limits
    if (userLimit.minute.count >= limits.maxPerMinute) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: userLimit.minute.resetTime,
        reason: 'Rate limit exceeded: too many messages per minute'
      };
    }

    if (userLimit.hour.count >= limits.maxPerHour) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: userLimit.hour.resetTime,
        reason: 'Rate limit exceeded: too many messages per hour'
      };
    }

    if (userLimit.day.count >= limits.maxPerDay) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: userLimit.day.resetTime,
        reason: 'Rate limit exceeded: too many messages per day'
      };
    }

    return {
      allowed: true,
      remaining: Math.min(
        limits.maxPerMinute - userLimit.minute.count,
        limits.maxPerHour - userLimit.hour.count,
        limits.maxPerDay - userLimit.day.count
      ),
      resetTime: userLimit.minute.resetTime
    };
  }

  incrementCount(userId: string): void {
    const userLimit = this.userLimits.get(userId);
    if (userLimit) {
      userLimit.minute.count++;
      userLimit.hour.count++;
      userLimit.day.count++;
    }
  }

  getRemainingLimits(userId: string): { minute: number; hour: number; day: number } {
    const userLimit = this.userLimits.get(userId);
    if (!userLimit) {
      return { 
        minute: this.defaultLimits.maxPerMinute,
        hour: this.defaultLimits.maxPerHour,
        day: this.defaultLimits.maxPerDay
      };
    }

    return {
      minute: this.defaultLimits.maxPerMinute - userLimit.minute.count,
      hour: this.defaultLimits.maxPerHour - userLimit.hour.count,
      day: this.defaultLimits.maxPerDay - userLimit.day.count
    };
  }
}

export const rateLimiter = new RateLimiter();
