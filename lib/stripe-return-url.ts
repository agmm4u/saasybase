/** Build the app return URL used after Stripe redirects a customer for authentication. */
export function buildStripePaymentReturnUrl(origin: string, clientSecret?: string): string {
  const returnUrl = new URL('/checkout/return', origin);
  returnUrl.searchParams.set('status', 'success');
  returnUrl.searchParams.set('provider', 'stripe');

  // Include only the PaymentIntent ID for server-side status verification.
  // Never put the client secret itself in the browser URL.
  const paymentIntentId = clientSecret?.split('_secret_')[0];
  if (paymentIntentId && /^pi_[A-Za-z0-9]+$/.test(paymentIntentId)) {
    returnUrl.searchParams.set('payment_id', paymentIntentId);
  }

  return returnUrl.toString();
}
