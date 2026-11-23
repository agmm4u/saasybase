import Link from 'next/link';
import type { ReactNode } from 'react';

export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto grid min-h-[min(760px,calc(100svh-12rem))] w-full max-w-6xl items-center gap-8 px-2 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:gap-16 lg:px-10 lg:py-14">
      <div className="relative hidden overflow-hidden rounded-[2rem] border border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-indigo-100 p-10 dark:border-violet-400/15 dark:from-violet-950/70 dark:via-neutral-950 dark:to-indigo-950/60 lg:block">
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative flex h-full min-h-[28rem] flex-col justify-between">
          <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-semibold tracking-wide text-violet-700 dark:text-violet-300">
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white">S</span>
            YOUNG AGE CORPORATION CO., LTD.
          </Link>
          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300">{eyebrow}</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white xl:text-5xl">
              Build something great. We&apos;ll handle the foundation.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600 dark:text-neutral-300">
              One secure place for your account, workspace, billing, and product tools.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-neutral-400">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" />
            Secure access to your SaaS workspace
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center lg:text-left">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-300 lg:hidden">
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white">S</span>
            YOUNG AGE CORPORATION CO., LTD.
          </Link>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-400">{description}</p>
        </div>
        {children}
        <p className="mt-6 text-center text-xs leading-5 text-slate-500 dark:text-neutral-400">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="font-medium underline underline-offset-4 hover:text-violet-600 dark:hover:text-violet-300">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="font-medium underline underline-offset-4 hover:text-violet-600 dark:hover:text-violet-300">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
