import type { ReactElement } from 'react';

import type { Character } from '../../types/character';

interface Props {
  character: Character;
}

function Card({ character }: Props): ReactElement {
  return (
    <article className="card">
      <img src={character.image} alt={character.name} width="120" />
      <h2>{character.name}</h2>
      <p>{character.species}</p>
      <p>{character.status}</p>
    </article>
  );
}

export default Card;
