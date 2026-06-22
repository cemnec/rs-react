import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import type { Character } from '@/types/character';

type Props = {
  character: Character;
  query: string;
  page: number;
  selectedId?: string;
};

function buildCharacterHref({
  query,
  page,
  selectedId,
}: {
  query: string;
  page: number;
  selectedId: number;
}): string {
  const params = new URLSearchParams({
    page: String(page),
    selectedId: String(selectedId),
  });

  if (query) {
    params.set('query', query);
  }

  return `/?${params}`;
}

export default function CharacterCard({
  character,
  query,
  page,
  selectedId,
}: Props) {
  const isSelected = selectedId === String(character.id);

  return (
    <li>
      <Link
        aria-current={isSelected ? 'true' : undefined}
        className={`character-card${isSelected ? ' character-card--selected' : ''}`}
        href={buildCharacterHref({
          query,
          page,
          selectedId: character.id,
        })}
      >
        <Image
          alt={character.name}
          className="character-card__image"
          height={120}
          src={character.image}
          width={120}
        />

        <span className="character-card__content">
          <strong>{character.name}</strong>
          <span>
            {character.status} — {character.species}
          </span>
        </span>
      </Link>
    </li>
  );
}
