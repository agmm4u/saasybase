import { AuthResetPassword } from '@/lib/auth-provider/client';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { AuthFormWrapper } from '@/components/ui/AuthFormWrapper';
import { AuthLoadingSkeleton } from '@/components/ui/AuthLoadingSkeleton';
import { redirect } from 'next/navigation';

const formCardClass = 'w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/30';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const authProvider = (process.env.AUTH_PROVIDER || 'betterauth').toLowerCase();
  if (authProvider === 'clerk') {
    const params = await searchParams;
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      if (typeof value === 'string') query.set(key, value);
      else if (Array.isArray(value)) value.forEach((entry) => query.append(key, entry));
    }
    redirect(`/sign-in/reset-password${query.size ? `?${query.toString()}` : ''}`);
  }
  const isNextAuth = authProvider === 'nextauth';

  return (
    <AuthPageShell
      eyebrow="Account recovery"
      title="Choose a new password"
      description="Set a strong password to secure your account. Reset links can only be used once."
    >
      <AuthFormWrapper fallback={<AuthLoadingSkeleton />}>
        <div className={isNextAuth ? formCardClass : 'w-full'}>
          <AuthResetPassword />
        </div>
      </AuthFormWrapper>
    </AuthPageShell>
  );
}
