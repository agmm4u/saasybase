import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const prismaMock = vi.hoisted(() => ({
  plan: {
    updateMany: vi.fn(async () => ({ count: 0 })),
    upsert: vi.fn(async () => ({})),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
}));

const loggerMock = vi.hoisted(() => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

vi.mock('../lib/prisma', () => ({ prisma: prismaMock }));
vi.mock('../lib/logger', () => ({ Logger: loggerMock }));
vi.mock('../lib/runtime-guards', () => ({
  toError: (error: unknown) => (error instanceof Error ? error : new Error(String(error))),
}));

import { ensurePlansSeeded, resolveSeededPlanPriceForProvider, syncPlanExternalPriceIds, PLAN_DEFINITIONS } from '../lib/plans';

describe('plan provider safety', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('uses the requested $30 per day rate across seeded plan durations', () => {
    const prices = Object.fromEntries(PLAN_DEFINITIONS.map((plan) => [plan.id, plan.priceCents]));
    expect(prices).toEqual({
      '24H': 3000,
      '7D': 21000,
      '1M_OT': 90000,
      '1D_SUB': 3000,
      '1W_SUB': 21000,
      '1M_SUB': 90000,
      '1Y_SUB': 1095000,
    });
  });

  it('prefers the provider-mapped seeded price over an incompatible env placeholder', () => {
    const plan = PLAN_DEFINITIONS.find((entry) => entry.id === '24H');
    expect(plan).toBeTruthy();

    process.env.PAYMENT_PROVIDER = 'paddle';
    process.env.PAYMENT_PRICE_24H = 'price_seed_stripe';

    const resolved = resolveSeededPlanPriceForProvider(plan!, {
      providerKey: 'paddle',
      externalPriceIds: JSON.stringify({ paddle: 'pri_live_paddle' }),
      legacyExternalPriceId: 'price_seed_stripe',
    });

    expect(resolved.priceId).toBe('pri_live_paddle');
    expect(resolved.source).toBe('provider-map');
  });

  it('skips env sync when the active provider does not match the env price id shape', async () => {
    const plan = PLAN_DEFINITIONS.find((entry) => entry.id === '24H');
    expect(plan).toBeTruthy();

    process.env.PAYMENT_PROVIDER = 'paddle';
    process.env.PAYMENT_PRICE_24H = 'price_seed_stripe';

    prismaMock.plan.findUnique.mockResolvedValue({
      id: 'plan_24h',
      externalPriceId: null,
      externalPriceIds: null,
    });

    await syncPlanExternalPriceIds();

    expect(prismaMock.plan.update).not.toHaveBeenCalled();
    expect(loggerMock.info).toHaveBeenCalledWith(
      'Skipping plan external price sync because env value does not match the active provider',
      expect.objectContaining({
        planId: '24H',
        provider: 'paddle',
      })
    );
  });

  it('persists seeded short descriptions for plans that define them', async () => {
    await ensurePlansSeeded();

    expect(prismaMock.plan.updateMany).toHaveBeenCalledWith({
      where: { name: { in: ['Quarterly Pro'] }, active: true },
      data: { active: false },
    });

    expect(prismaMock.plan.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'Weekly Pro' },
        update: expect.objectContaining({
          shortDescription: 'Weekly access, billed every week.',
        }),
        create: expect.objectContaining({
          shortDescription: 'Weekly access, billed every week.',
        }),
      })
    );

    expect(prismaMock.plan.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'Daily Pro' },
        update: expect.objectContaining({
          recurringInterval: 'day',
          priceCents: 3000,
        }),
        create: expect.objectContaining({
          recurringInterval: 'day',
          priceCents: 3000,
        }),
      })
    );

    expect(prismaMock.plan.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'Monthly Pro' },
        update: expect.objectContaining({
          shortDescription: 'Flexible monthly access.',
        }),
        create: expect.objectContaining({
          shortDescription: 'Flexible monthly access.',
        }),
      })
    );
  });
});
