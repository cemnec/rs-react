import '../globals.css';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import Header from '@/components/Header/Header';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'RS React Next.js',
  description: 'Rick and Morty characters application migrated to Next.js',
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <div className="app-shell">
            <Header />
            <main className="app-main">{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
