/**
 * Tests: Rate Limiter (lib/rate-limit.ts)
 * Tarea #24 — Verifica token bucket, cleanup, y pre-configurados
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimit } from '@/lib/rate-limit'

describe('rateLimit', () => {
  let limiter: ReturnType<typeof rateLimit>

  beforeEach(() => {
    limiter = rateLimit({ interval: 1000, limit: 3 }) // 3 req per second for fast tests
  })

  describe('check()', () => {
    it('permite las primeras N peticiones', () => {
      const r1 = limiter.check('user1')
      expect(r1.success).toBe(true)
      expect(r1.remaining).toBe(2)

      const r2 = limiter.check('user1')
      expect(r2.success).toBe(true)
      expect(r2.remaining).toBe(1)

      const r3 = limiter.check('user1')
      expect(r3.success).toBe(true)
      expect(r3.remaining).toBe(0)
    })

    it('bloquea después de exceder el límite', () => {
      limiter.check('user1')
      limiter.check('user1')
      limiter.check('user1')

      const r4 = limiter.check('user1')
      expect(r4.success).toBe(false)
      expect(r4.remaining).toBe(0)
    })

    it('diferentes keys tienen buckets separados', () => {
      limiter.check('user1')
      limiter.check('user1')
      limiter.check('user1')

      // user2 debería tener su propio bucket
      const r = limiter.check('user2')
      expect(r.success).toBe(true)
      expect(r.remaining).toBe(2)
    })
  })

  describe('status()', () => {
    it('muestra tokens restantes sin consumir', () => {
      expect(limiter.status('newuser').remaining).toBe(3)

      limiter.check('newuser')
      // Status should show remaining without consuming
      const status = limiter.status('newuser')
      expect(status.remaining).toBeGreaterThanOrEqual(1)
    })
  })

  describe('reset()', () => {
    it('resetea el bucket de un usuario', () => {
      limiter.check('user1')
      limiter.check('user1')
      limiter.check('user1')

      // Should be blocked
      expect(limiter.check('user1').success).toBe(false)

      // Reset
      limiter.reset('user1')

      // Should work again
      expect(limiter.check('user1').success).toBe(true)
    })
  })

  describe('clear()', () => {
    it('limpia todos los buckets', () => {
      limiter.check('user1')
      limiter.check('user2')

      limiter.clear()

      expect(limiter.status('user1').remaining).toBe(3)
      expect(limiter.status('user2').remaining).toBe(3)
    })
  })
})
