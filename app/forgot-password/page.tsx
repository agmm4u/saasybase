import { AuthForgotPassword } from '@/lib/auth-provider/client';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { AuthFormWrapper } from '@/components/ui/AuthFormWrapper';
import { AuthLoadingSkeleton } from '@/components/ui/AuthLoadingSkeleton';
import { adminOnlyPublicSiteMode } from '@/lib/admin-only-public-site';
import { redirect } from 'next/navigation';

const formCardClass = 'w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/30';

export default function ForgotPasswordPage() {
  const authProvider = (process.env.AUTH_PROVIDER || 'betterauth').toLowerCase();
  if (authProvider === 'clerk') {
    redirect('/sign-in/forgot-password');
  }
  const isNextAuth = authProvider === 'nextauth';

  return (
    <AuthPageShell
      eyebrow="Account recovery"
      title="Forgot your password?"
      description="Enter the email address on your account and we’ll send you a secure link to choose a new password."
    >
      <AuthFormWrapper fallback={<AuthLoadingSkeleton />}>
        <div className={isNextAuth ? formCardClass : 'w-full'}>
          <AuthForgotPassword />
        </div>
      </AuthFormWrapper>
      {adminOnlyPublicSiteMode ? (
        <p className="mt-4 text-center text-xs text-slate-500 dark:text-neutral-400">Administrator access only.</p>
      ) : null}
    </AuthPageShell>
  );
}
