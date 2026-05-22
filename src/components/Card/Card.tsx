import type { ReactElement } from 'react';
import { Link, useSearchParams } from 'react-router';

import type { Character } from '../../types/character';

interface Props {
  character: Character;
}

function Card({ character }: Props): ReactElement {
  const [searchParams] = useSearchParams();

  return (
    <article className="card">
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
