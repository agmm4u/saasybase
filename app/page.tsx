import Link from 'next/link';
import type { Metadata } from 'next';
import { getSeoSettings } from '../lib/seo';
import { getSiteName, SETTING_DEFAULTS, SETTING_KEYS } from '../lib/settings';

const FALLBACK_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || SETTING_DEFAULTS[SETTING_KEYS.SITE_NAME];

export async function generateMetadata(): Promise<Metadata> {
  const [siteName, seoSettings] = await Promise.all([
    getSiteName().catch(() => FALLBACK_SITE_NAME),
    getSeoSettings().catch(() => null),
  ]);

  const trimmedSiteName = siteName.trim() || FALLBACK_SITE_NAME;
  const title = seoSettings?.homeMetaTitle.trim() || `${trimmedSiteName} Boilerplate`;
  const description = seoSettings?.homeMetaDescription.trim() || 'Launch your SaaS faster with a production-ready foundation for authentication, billing, teams, and operations.';
  const ogTitle = seoSettings?.homeOgTitle?.trim() || seoSettings?.defaultOgTitle?.trim() || title;
  const ogDescription = seoSettings?.homeOgDescription?.trim() || seoSettings?.defaultOgDescription?.trim() || description;
  const ogImage = seoSettings?.resolvedHomeOgImageUrl || seoSettings?.resolvedDefaultOgImageUrl;
  const canonical = seoSettings?.resolvedHomeCanonicalUrl;

  return {
    title: { absolute: title },
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: 'website',
    },
    twitter: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
      card: ogImage ? 'summary_large_image' : 'summary',
    },
  };
}

const highlights = [
  {
    number: '01',
    title: 'A complete account experience',
    description: 'Give customers a secure place to sign up, manage their profile, and keep their workspace organized.',
  },
  {
    number: '02',
    title: 'Billing that grows with you',
    description: 'Present clear plans and support subscriptions and payments through the provider that fits your business.',
  },
  {
    number: '03',
    title: 'Operate with confidence',
    description: 'Use built-in dashboards for customers and admins, with support, notifications, and usage insights close at hand.',
  },
];

export default function PublicExportHomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 lg:px-10">
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-violet-200/70 bg-gradient-to-br from-white via-violet-50 to-indigo-100 px-6 py-16 shadow-sm dark:border-violet-400/15 dark:from-neutral-950 dark:via-violet-950/50 dark:to-indigo-950/60 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
        <div aria-hidden="true" className="absolute -right-24 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet-400/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-52 left-1/3 -z-10 h-[28rem] w-[28rem] rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-800 dark:border-violet-300/20 dark:bg-neutral-950/50 dark:text-violet-200">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" />
            Your SaaS starts here
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Launch your SaaS.
            <span className="block text-violet-700 dark:text-violet-300">Skip the setup grind.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-neutral-300 sm:text-lg sm:leading-8">
            YOUNG AGE CORPORATION CO., LTD. gives your product the essential foundation—accounts, plans, billing, teams, and admin tools—so you can focus on the experience only you can build.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/15 transition hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
            >
              Create your account
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-violet-300 hover:bg-white dark:border-neutral-700 dark:bg-neutral-950/50 dark:text-neutral-100 dark:hover:border-violet-400/50 dark:hover:bg-neutral-900"
            >
              Explore plans
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-500 dark:text-neutral-400">
            Already have an account? <Link href="/sign-in" className="font-semibold text-violet-700 hover:underline dark:text-violet-300">Sign in</Link>
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">The essentials, already connected</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Spend less time wiring things together.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-neutral-400">
            Start with a polished customer journey and the tools to run it—from the first account to the day-to-day operations.
          </p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article key={highlight.number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                {highlight.number}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{highlight.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-400">{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-8 dark:border-neutral-800 dark:bg-neutral-900/70 sm:flex-row sm:items-center sm:justify-between sm:px-9">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Ready to see what fits?</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-neutral-400">Compare the available plans or get in touch with our team.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-200">
            View pricing
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}