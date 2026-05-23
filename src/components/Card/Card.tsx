import React, { type ReactElement } from 'react';
import { Link, useSearchParams } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSelectedItem } from '../../store/selectedItemsSlice';
import type { Character } from '../../types/character';

interface Props {
  character: Character;
}

function Card({ character }: Props): ReactElement {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const isSelected = useAppSelector((state) =>
    state.selectedItems.items.some(
      (selectedItem) => selectedItem.id === character.id,
    ),
  );

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    event.stopPropagation();

    dispatch(
      toggleSelectedItem({
        id: character.id,
        name: character.name,
        status: character.status,
        species: character.species,
        gender: character.gender,
        image: character.image,
        detailsUrl: `/characters/${character.id}`,
      }),
    );
  };

  return (
    <article className="card">
      <label className="card-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelectionChange}
          onClick={(event) => event.stopPropagation()}
          aria-label={`Select ${character.name}`}
        />
        Select
      </label>

      <Link
        to={{
          pathname: `/characters/${character.id}`,
          search: searchParams.toString(),
        }}
        className="card-link"
      >
        <img src={character.image} alt={character.name} />
        <h2>{character.name}</h2>
        <p>{character.species}</p>
        <p>{character.status}</p>
      </Link>
    </article>
  );
}

export default Card;
