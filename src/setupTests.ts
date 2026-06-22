import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

type TranslationValues = Record<string, string | number>;

const translations: Record<string, Record<string, string>> = {
  Search: {
    label: 'Search by character name',
    placeholder: 'Rick, Morty, Summer...',
    submit: 'Search',
    emptyResults: 'No characters found. Try another search query.',
  },
  CharacterDetails: {
    title: 'Character details',
    notFound: 'Character was not found.',
    status: 'Status',
    species: 'Species',
    gender: 'Gender',
    origin: 'Origin',
    location: 'Location',
    close: 'Close details',
  },
  Pagination: {
    label: 'Pagination',
    previous: 'Previous',
    next: 'Next',
    page: 'Page {page} of {pages}',
  },
  SelectCharacterCheckbox: {
    label: 'Select',
  },
  SelectedItemsFlyout: {
    count: '{count} selected characters',
    download: 'Download CSV',
    downloading: 'Downloading...',
    clear: 'Clear',
  },
  NotFoundPage: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist.',
    backHome: 'Back to home',
  },
  AboutPage: {
    title: 'About',
    description:
      'This application was migrated from Vite to Next.js App Router.',
  },
};

function interpolate(template: string, values?: TranslationValues): string {
  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? `{${key}}`),
  );
}

function createTranslator(namespace?: string) {
  return (key: string, values?: TranslationValues): string => {
    const template = namespace ? translations[namespace]?.[key] : undefined;

    return interpolate(template ?? key, values);
  };
}

vi.mock('next-intl', () => ({
  hasLocale: (locales: readonly string[], locale: string) =>
    locales.includes(locale),
  NextIntlClientProvider: ({ children }: { children: ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  useTranslations: (namespace?: string) => createTranslator(namespace),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: async (namespace?: string) => createTranslator(namespace),
  setRequestLocale: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: (props: {
    alt?: string;
    src: string | { src: string };
    [key: string]: unknown;
  }) => {
    const { alt = '', src, ...restProps } = props;
    const imageProps = { ...restProps } as Record<string, unknown>;

    delete imageProps.priority;
    delete imageProps.fill;
    delete imageProps.loader;
    delete imageProps.quality;
    delete imageProps.placeholder;
    delete imageProps.blurDataURL;

    return React.createElement('img', {
      ...imageProps,
      alt,
      src: typeof src === 'string' ? src : src.src,
    });
  },
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => React.createElement('a', { ...props, href }, children),
  redirect: vi.fn(),
  usePathname: () => '/',
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
  getPathname: vi.fn(),
}));
