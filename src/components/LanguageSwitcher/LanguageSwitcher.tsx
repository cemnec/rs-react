'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { type ChangeEvent, useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('LanguageSwitcher');
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;

    startTransition(() => {
      const queryString = searchParams.toString();
      const href = `${pathname}${queryString ? `?${queryString}` : ''}`;

      router.replace(href, { locale: nextLocale });
    });
  };

  return (
    <label className="language-switcher">
      <span>{t('label')}: </span>
      <select
        aria-label={t('label')}
        disabled={isPending}
        onChange={handleChange}
        value={locale}
      >
        {routing.locales.map((item) => (
          <option key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
