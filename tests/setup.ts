import '@testing-library/jest-dom/vitest'

// Mock Supabase client globally
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

// Helper: create a chainable Supabase mock
export function createMockQuery(data: unknown = [], error: unknown = null) {
  const chain: Record<string, unknown> = {}
  const methods = [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'or', 'filter',
    'order', 'limit', 'range', 'single', 'maybeSingle',
  ]

  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain)
  }

  // Terminal methods return the result
  chain.single = vi.fn().mockResolvedValue({ data, error })
  chain.maybeSingle = vi.fn().mockResolvedValue({ data, error })

  // select() at the end returns the data
  const originalSelect = chain.select
  chain.select = vi.fn((...args: unknown[]) => {
    if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('count')) {
      return { ...chain, then: (resolve: (v: unknown) => void) => resolve({ data, error, count: Array.isArray(data) ? data.length : 0 }) }
    }
    return chain
  })

  // Make the chain itself thenable (for await)
  chain.then = (resolve: (v: unknown) => void) => resolve({ data, error, count: Array.isArray(data) ? data.length : 0 })

  return chain
}

// Global Supabase mock
export const mockSupabase = {
  from: vi.fn(() => createMockQuery()),
  rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
}

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})
