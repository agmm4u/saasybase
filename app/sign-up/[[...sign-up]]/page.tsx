import { AuthSignUp } from '@/lib/auth-provider/client';
import { getAuthFormAppearance } from '@/lib/auth-provider/client/clerk-appearance';
import { AuthLoadingSkeleton } from '@/components/ui/AuthLoadingSkeleton';
import { AuthFormWrapper } from '@/components/ui/AuthFormWrapper';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { authService } from '@/lib/auth-provider';
import { adminOnlyPublicSiteMode } from '@/lib/admin-only-public-site';
import { sanitizeReturnPath } from '@/lib/route-guards';
import { redirect } from 'next/navigation';

type SearchParams = Record<string, string | string[] | undefined> | undefined;

function normalizeRedirect(searchParams: SearchParams, fallbackPath: string): string {
  const rawParam = searchParams?.redirect_url ?? searchParams?.returnBackUrl ?? searchParams?.redirectUrl;
  const pick = Array.isArray(rawParam) ? rawParam[0] : rawParam;

  return sanitizeReturnPath(pick, fallbackPath);
}

interface SignUpPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const pageCardClass = 'w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/30';

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectPath = normalizeRedirect(resolvedSearchParams, adminOnlyPublicSiteMode ? '/admin' : '/dashboard/onboarding');
  const { userId } = await authService.getSession();
  const isNextAuth = (process.env.AUTH_PROVIDER || 'betterauth').toLowerCase() === 'nextauth';

  if (userId) {
    redirect(redirectPath);
  }

  if (adminOnlyPublicSiteMode) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`);
  }

  const signInUrl = `/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`;

  return (
    <AuthPageShell
      eyebrow="Get started"
      title="Create your account"
      description="Set up your account and get straight to building with your SaaS workspace."
    >
        <AuthFormWrapper fallback={<AuthLoadingSkeleton />}>
          <div className="flex justify-center">
            <div className={isNextAuth ? pageCardClass : 'w-full'}>
              <AuthSignUp 
                routing="path"
                path="/sign-up"
                fallback={<AuthLoadingSkeleton />}
                appearance={getAuthFormAppearance('page')}
                fallbackRedirectUrl={redirectPath}
                forceRedirectUrl={redirectPath}
                signInUrl={signInUrl}
              />
            </div>
          </div>
        </AuthFormWrapper>
    </AuthPageShell>
  );
}
