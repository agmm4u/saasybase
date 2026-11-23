import { describe, expect, it } from 'vitest';
import { GET } from '../app/auth/magic-link/route';
import { POST } from '../app/api/auth/magic-link/route';

describe('GET /auth/magic-link', () => {
  it('disables passwordless sign-in links', async () => {
    const response = await GET();

    expect(response.status).toBe(410);
    expect(await response.json()).toEqual({
      error: 'Email-link sign-in is disabled. Use your email and password.',
    });
  });

  it('rejects requests to send a Better Auth magic-link email', async () => {
    const response = await POST();

    expect(response.status).toBe(410);
    expect(await response.json()).toEqual({
      error: 'Magic-link sign-in is disabled. Use your email and password.',
    });
  });
});
