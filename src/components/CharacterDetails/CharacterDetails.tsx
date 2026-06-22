import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { getCharacterById } from '@/services/characters';

type Props = {
  selectedId: string;
  query: string;
  page: number;
};

function buildCloseHref({
  query,
  page,
}: {
  query: string;
  page: number;
}): string {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (query) {
    params.set('query', query);
  }

  return `/?${params.toString()}`;
}

export default async function CharacterDetails({
  selectedId,
  query,
  page,
}: Props) {
  const t = await getTranslations('CharacterDetails');
  const closeHref = buildCloseHref({ query, page });

  const character = await getCharacterById(selectedId);

  if (!character) {
    return (
      <aside
        className="details-panel"
        aria-labelledby="character-details-title"
      >
        <Link
          aria-label={t('close')}
          className="details-panel__close"
          href={closeHref}
        />

        <h2 className="details-panel__title" id="character-details-title">
          {t('title')}
        </h2>

        <p>{t('notFound')}</p>
      </aside>
    );
  }

  return (
    <aside className="details-panel" aria-labelledby="character-details-title">
      <Link
        aria-label={t('close')}
        className="details-panel__close"
        href={closeHref}
      />

      <Image
        alt={character.name}
        className="details-panel__image"
        height={240}
        priority
        src={character.image}
        width={240}
      />

      <h2 className="details-panel__title" id="character-details-title">
        {character.name}
      </h2>

      <dl className="details-list">
        <div>
          <dt>{t('status')}</dt>
          <dd>{character.status}</dd>
        </div>

        <div>
          <dt>{t('species')}</dt>
          <dd>{character.species}</dd>
        </div>

        <div>
          <dt>{t('gender')}</dt>
          <dd>{character.gender}</dd>
        </div>

        <div>
          <dt>{t('origin')}</dt>
          <dd>{character.origin.name}</dd>
        </div>

        <div>
          <dt>{t('location')}</dt>
          <dd>{character.location.name}</dd>
        </div>
      </dl>
    </aside>
  );
}
