import { getTranslations } from 'next-intl/server';

import CharacterCard from '@/components/CharacterCard/CharacterCard';
import type { Character } from '@/types/character';

type Props = {
  characters: Character[];
  query: string;
  page: number;
  selectedId?: string;
};

export default async function CharacterList({
  characters,
  query,
  page,
  selectedId,
}: Props) {
  const t = await getTranslations('Search');

  if (characters.length === 0) {
    return <p className="empty-state">{t('emptyResults')}</p>;
  }

  return (
    <ul className="character-list">
      {characters.map((character) => (
        <CharacterCard
          character={character}
          key={character.id}
          page={page}
          query={query}
          selectedId={selectedId}
        />
      ))}
    </ul>
  );
}
