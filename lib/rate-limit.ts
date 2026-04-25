/**
 * Rate Limiter — Tarea #24
 * In-memory sliding window rate limiter for API routes.
 * 
 * Usage in API routes:
 *   import { rateLimit } from '@/lib/rate-limit'
 *   
 *   const limiter = rateLimit({ interval: 60_000, limit: 30 })
 *   
 *   export async function POST(req: Request) {
 *     const ip = req.headers.get('x-forwarded-for') || 'anon'
 *     const { success, remaining, reset } = limiter.check(ip)
 *     if (!success) {
 *       return Response.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(reset) } })
 *     }
 *     // ... handle request
 *   }
 */

interface RateLimitConfig {
  /** Window duration in milliseconds (default: 60,000 = 1 minute) */
  interval: number
  /** Max requests per window (default: 30) */
  limit: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  /** Seconds until window resets */
  reset: number
}

interface TokenBucket {
  tokens: number
  lastRefill: number
}

/**
 * Creates a rate limiter instance using the Token Bucket algorithm.
 * Each unique key (typically IP address) gets its own bucket.
 */
export function rateLimit(config: RateLimitConfig = { interval: 60_000, limit: 30 }) {
  const buckets = new Map<string, TokenBucket>()
  
  // Cleanup old entries every 5 minutes to prevent memory leak
  const CLEANUP_INTERVAL = 5 * 60_000
  let lastCleanup = Date.now()

  function cleanup() {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return
    
    for (const [key, bucket] of buckets.entries()) {
      if (now - bucket.lastRefill > config.interval * 2) {
        buckets.delete(key)
      }
    }
    lastCleanup = now
  }

  return {
    check(key: string): RateLimitResult {
      cleanup()
      
      const now = Date.now()
      const bucket = buckets.get(key)

      if (!bucket) {
        // First request from this key
        buckets.set(key, { tokens: config.limit - 1, lastRefill: now })
        return { success: true, remaining: config.limit - 1, reset: Math.ceil(config.interval / 1000) }
      }

      // Refill tokens based on elapsed time
      const elapsed = now - bucket.lastRefill
      const refillRate = config.limit / config.interval // tokens per ms
      const tokensToAdd = elapsed * refillRate
      
      bucket.tokens = Math.min(config.limit, bucket.tokens + tokensToAdd)
      bucket.lastRefill = now

      if (bucket.tokens < 1) {
        // Rate limited
        const resetMs = (1 - bucket.tokens) / refillRate
        return { success: false, remaining: 0, reset: Math.ceil(resetMs / 1000) }
      }

      // Consume a token
      bucket.tokens -= 1
      return { success: true, remaining: Math.floor(bucket.tokens), reset: Math.ceil(config.interval / 1000) }
    },

    /** Get current status for a key without consuming a token */
    status(key: string): { remaining: number } {
      const bucket = buckets.get(key)
      if (!bucket) return { remaining: config.limit }
      
      const now = Date.now()
      const elapsed = now - bucket.lastRefill
      const refillRate = config.limit / config.interval
      const currentTokens = Math.min(config.limit, bucket.tokens + elapsed * refillRate)
      
      return { remaining: Math.floor(currentTokens) }
    },

    /** Reset limiter for a specific key (e.g., after successful auth) */
    reset(key: string) {
      buckets.delete(key)
    },

    /** Clear all buckets (for testing) */
    clear() {
      buckets.clear()
    },
  }
}

// ============================================================
// Pre-configured limiters for common use cases
// ============================================================

/** General API: 60 requests per minute */
export const apiLimiter = rateLimit({ interval: 60_000, limit: 60 })

/** Auth endpoints: 5 attempts per minute */
export const authLimiter = rateLimit({ interval: 60_000, limit: 5 })

/** POS sales: 120 transactions per minute (high-volume POS) */
export const salesLimiter = rateLimit({ interval: 60_000, limit: 120 })

/** Reports: 10 requests per minute (expensive queries) */
export const reportLimiter = rateLimit({ interval: 60_000, limit: 10 })
