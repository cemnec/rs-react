import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

type Props = {
  query: string;
  page: number;
  pages: number;
  selectedId?: string;
};

function buildPageHref({
  query,
  page,
  selectedId,
}: {
  query: string;
  page: number;
  selectedId?: string;
}): string {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (query) {
    params.set('query', query);
  }

  if (selectedId) {
    params.set('selectedId', selectedId);
  }

  return `/?${params}`;
}

export default async function Pagination({
  query,
  page,
  pages,
  selectedId,
}: Props) {
  const t = await getTranslations('Pagination');

  if (pages <= 1) {
    return null;
  }

  const hasPrevious = page > 1;
  const hasNext = page < pages;

  return (
    <nav aria-label={t('label')} className="pagination">
      {hasPrevious ? (
        <Link
          className="pagination__link"
          href={buildPageHref({
            query,
            page: page - 1,
            selectedId,
          })}
        >
          {t('previous')}
        </Link>
      ) : (
        <span className="pagination__link pagination__link--disabled">
          {t('previous')}
        </span>
      )}

      <span>{t('page', { page, pages })}</span>

      {hasNext ? (
        <Link
          className="pagination__link"
          href={buildPageHref({
            query,
            page: page + 1,
            selectedId,
          })}
        >
          {t('next')}
        </Link>
      ) : (
        <span className="pagination__link pagination__link--disabled">
          {t('next')}
        </span>
      )}
    </nav>
  );
}
