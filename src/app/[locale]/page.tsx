import { getTranslations, setRequestLocale } from 'next-intl/server';

import CharacterDetails from '@/components/CharacterDetails/CharacterDetails';
import CharacterList from '@/components/CharacterList/CharacterList';
import Pagination from '@/components/Pagination/Pagination';
import SearchForm from '@/components/SearchForm/SearchForm';
import type { Locale } from '@/i18n/routing';
import { getCharacters } from '@/services/characters';

type SearchParams = {
  query?: string | string[];
  page?: string | string[];
  selectedId?: string | string[];
};

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<SearchParams>;
};

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

function getPage(value: string | string[] | undefined): number {
  const page = Number(getSingleSearchParam(value));

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  setRequestLocale(locale);

  const t = await getTranslations('HomePage');

  const query = getSingleSearchParam(resolvedSearchParams.query).trim();
  const page = getPage(resolvedSearchParams.page);
  const selectedId = getSingleSearchParam(resolvedSearchParams.selectedId);

  const characters = await getCharacters({ query, page });

  return (
    <section className="search-page">
      <div className="search-page__header">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>

      <SearchForm initialQuery={query} locale={locale} />

      <p className="results-summary">
        {t('results', { count: characters.info.count })}
      </p>

      <div
        className={`search-layout${selectedId ? ' search-layout--with-details' : ''}`}
      >
        <div className="search-layout__results">
          <CharacterList
            characters={characters.results}
            page={page}
            query={query}
            selectedId={selectedId}
          />

          <Pagination
            page={page}
            pages={characters.info.pages}
            query={query}
            selectedId={selectedId}
          />
        </div>

        {selectedId ? (
          <CharacterDetails page={page} query={query} selectedId={selectedId} />
        ) : null}
      </div>
    </section>
  );
}
