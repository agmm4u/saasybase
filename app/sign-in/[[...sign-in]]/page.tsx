import { AuthSignIn } from '@/lib/auth-provider/client';
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

interface SignInPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const pageCardClass = 'w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/30';

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectPath = normalizeRedirect(resolvedSearchParams, adminOnlyPublicSiteMode ? '/admin' : '/dashboard');
  const { userId } = await authService.getSession();
  const isNextAuth = (process.env.AUTH_PROVIDER || 'betterauth').toLowerCase() === 'nextauth';

  if (userId) {
    redirect(redirectPath);
  }

  const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent(redirectPath)}`;

  return (
    <AuthPageShell
      eyebrow={adminOnlyPublicSiteMode ? 'Administrator access' : 'Welcome back'}
      title={adminOnlyPublicSiteMode ? 'Admin sign in' : 'Sign in to your account'}
      description={adminOnlyPublicSiteMode
        ? 'Access the admin area for this public-site deployment.'
        : 'Sign in to open your workspace, manage your plan, and pick up where you left off.'}
    >
        <AuthFormWrapper fallback={<AuthLoadingSkeleton />}>
          <div className="flex justify-center">
            <div className={isNextAuth ? pageCardClass : 'w-full'}>
              <AuthSignIn 
                routing="path"
                path="/sign-in"
                fallback={<AuthLoadingSkeleton />}
                appearance={getAuthFormAppearance('page')}
                fallbackRedirectUrl={redirectPath}
                forceRedirectUrl={redirectPath}
                {...(!adminOnlyPublicSiteMode ? { signUpUrl } : {})}
              />
            </div>
          </div>
        </AuthFormWrapper>
    </AuthPageShell>
  );
}
