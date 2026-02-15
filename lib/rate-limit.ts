/**
 * Rate limiting for free tier conversions
 * Tracks conversions per IP address with daily reset
 */

import { headers } from "next/headers";

const FREE_TIER_LIMIT = 3;
const RESET_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory storage for rate limiting (in production, use Redis or database)
const rateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

/**
 * Get the client's IP address
 */
function getClientIP(): string {
  const headersList = headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback for local development
  return "127.0.0.1";
}

/**
 * Check if user has remaining free conversions
 */
export function checkRateLimit(): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const ip = getClientIP();
  const now = Date.now();
  
  let data = rateLimitStore.get(ip);
  
  // Initialize or reset if expired
  if (!data || now >= data.resetAt) {
    data = {
      count: 0,
      resetAt: now + RESET_INTERVAL_MS,
    };
    rateLimitStore.set(ip, data);
  }
  
  const remaining = Math.max(0, FREE_TIER_LIMIT - data.count);
  const allowed = remaining > 0;
  
  return {
    allowed,
    remaining,
    resetAt: data.resetAt,
  };
}

/**
 * Increment the conversion count for the user
 */
export function incrementUsage(): void {
  const ip = getClientIP();
  const data = rateLimitStore.get(ip);
  
  if (data) {
    data.count += 1;
    rateLimitStore.set(ip, data);
  }
}

/**
 * Get current usage stats for the client
 */
export function getUsageStats(): {
  used: number;
  limit: number;
  remaining: number;
  resetAt: number;
} {
  const ip = getClientIP();
  const now = Date.now();
  
  let data = rateLimitStore.get(ip);
  
  if (!data || now >= data.resetAt) {
    data = {
      count: 0,
      resetAt: now + RESET_INTERVAL_MS,
    };
    rateLimitStore.set(ip, data);
  }
  
  return {
    used: data.count,
    limit: FREE_TIER_LIMIT,
    remaining: Math.max(0, FREE_TIER_LIMIT - data.count),
    resetAt: data.resetAt,
  };
}
