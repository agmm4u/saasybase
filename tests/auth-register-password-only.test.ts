import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
}));
const signUpEmailMock = vi.hoisted(() => vi.fn());
const rateLimitMock = vi.hoisted(() => vi.fn(async () => ({ allowed: true, reset: Date.now() + 60_000 })));

vi.mock('../lib/prisma', () => ({ prisma: prismaMock }));
vi.mock('../lib/rateLimit', () => ({
  rateLimit: rateLimitMock,
  getClientIP: () => '127.0.0.1',
  RATE_LIMITS: { AUTH: { limit: 10, windowMs: 60_000, message: 'Too many attempts' } },
}));
vi.mock('../lib/better-auth', () => ({
  betterAuthServer: { api: { signUpEmail: signUpEmailMock } },
}));
vi.mock('../lib/logger', () => ({ Logger: { error: vi.fn() } }));

import { POST } from '../app/api/auth/register/route';

describe('POST /api/auth/register email/password flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AUTH_PROVIDER = 'betterauth';
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.update.mockResolvedValue({});
    signUpEmailMock.mockResolvedValue({ user: { id: 'user_1' } });
  });

  it('creates a verified account using only email and password, without requesting email verification', async () => {
    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'new@example.com', password: 'StrongPassword123' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.requiresVerification).toBe(false);
    expect(signUpEmailMock).toHaveBeenCalledWith(expect.objectContaining({
      body: expect.objectContaining({
        email: 'new@example.com',
        password: 'StrongPassword123',
        name: 'new',
      }),
    }));
    expect(prismaMock.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { email: 'new@example.com' },
      data: expect.objectContaining({ emailVerifiedBool: true }),
    }));
  });
});
