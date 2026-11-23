import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('environment validation with non-Clerk authentication', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('DATABASE_URL', 'postgresql://postgres:postgres@127.0.0.1:5432/app');
    vi.stubEnv('AUTH_PROVIDER', 'betterauth');
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_example');
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_example');
    vi.stubEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_test_example');
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com');
    vi.stubEnv('ENCRYPTION_SECRET', 'a'.repeat(32));
    vi.stubEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', '');
    vi.stubEnv('CLERK_SECRET_KEY', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('allows Stripe checkout when Better Auth is active and Clerk keys are absent', async () => {
    const { validateEnv } = await import('@/lib/env');

    expect(validateEnv().NEXT_PUBLIC_APP_URL).toBe('https://example.com');
  });

  it('still requires Clerk keys when Clerk configuration is explicitly requested', async () => {
    const { validateClerkEnv } = await import('@/lib/env');

    expect(() => validateClerkEnv()).toThrow('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required');
  });
});
