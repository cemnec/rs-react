import Image from 'next/image';

import SelectCharacterCheckbox from '@/components/SelectCharacterCheckbox/SelectCharacterCheckbox';
import { Link } from '@/i18n/navigation';
import type { Character } from '@/types/character';
import type { SelectedItem } from '@/types/selectedItem';

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

  return `/?${params.toString()}`;
}

function mapCharacterToSelectedItem(
  character: Character,
  detailsUrl: string,
): SelectedItem {
  return {
    detailsUrl,
    gender: character.gender,
    id: character.id,
    name: character.name,
    species: character.species,
    status: character.status,
  };
}

export default function CharacterCard({
  character,
  query,
  page,
  selectedId,
}: Props) {
  const isSelected = selectedId === String(character.id);

  const detailsHref = buildCharacterHref({
    query,
    page,
    selectedId: character.id,
  });

  return (
    <li>
      <article
        className={`character-card${isSelected ? ' character-card--selected' : ''}`}
      >
        <SelectCharacterCheckbox
          item={mapCharacterToSelectedItem(character, detailsHref)}
        />

        <Link
          aria-current={isSelected ? 'true' : undefined}
          className="character-card__link"
          href={detailsHref}
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
      </article>
    </li>
  );
}
