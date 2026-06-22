'use server';

import { redirect } from 'next/navigation';

import type { Locale } from '@/i18n/routing';

export async function searchCharacters(
  locale: Locale,
  formData: FormData,
): Promise<void> {
  const rawQuery = formData.get('query');
  const query = typeof rawQuery === 'string' ? rawQuery.trim() : '';

  const params = new URLSearchParams();

  if (query) {
    params.set('query', query);
  }

  params.set('page', '1');

  const search = params.toString();

  redirect(`/${locale}${search ? `?${search}` : ''}`);
}
