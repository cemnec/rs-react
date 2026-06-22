import { getTranslations } from 'next-intl/server';

import { searchCharacters } from '@/actions/searchCharacters';
import type { Locale } from '@/i18n/routing';

type Props = {
  locale: Locale;
  initialQuery: string;
};

export default async function SearchForm({ locale, initialQuery }: Props) {
  const t = await getTranslations('Search');

  return (
    <form action={searchCharacters.bind(null, locale)} className="search-form">
      <label className="search-form__label" htmlFor="character-search">
        {t('label')}
      </label>

      <div className="search-form__controls">
        <input
          className="search-form__input"
          defaultValue={initialQuery}
          id="character-search"
          name="query"
          placeholder={t('placeholder')}
          type="search"
        />

        <button className="search-form__button" type="submit">
          {t('submit')}
        </button>
      </div>
    </form>
  );
}
