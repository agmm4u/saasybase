import { describe, expect, it } from 'vitest';
import { buildStripePaymentReturnUrl } from '../lib/stripe-return-url';

describe('buildStripePaymentReturnUrl', () => {
  it('returns to the checkout finalizer with a PaymentIntent ID, never its secret', () => {
    const url = new URL(buildStripePaymentReturnUrl(
      'https://ibangkok.ai',
      'pi_123abc_secret_privatevalue',
    ));

    expect(url.origin).toBe('https://ibangkok.ai');
    expect(url.pathname).toBe('/checkout/return');
    expect(url.searchParams.get('status')).toBe('success');
    expect(url.searchParams.get('provider')).toBe('stripe');
    expect(url.searchParams.get('payment_id')).toBe('pi_123abc');
    expect(url.toString()).not.toContain('privatevalue');
  });

  it('omits malformed PaymentIntent IDs', () => {
    const url = new URL(buildStripePaymentReturnUrl('https://ibangkok.ai', 'not-a-client-secret'));
    expect(url.searchParams.has('payment_id')).toBe(false);
  });
});
