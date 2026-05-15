import type { ReactElement } from 'react';

import type { Character } from '../../types/character';
import Card from '../Card';

interface Props {
  characters: Character[];
}

function CardList({ characters }: Props): ReactElement {
  return (
    <section className="card-list">
      {characters.map((character) => (
        <Card key={character.id} character={character} />
      ))}
    </section>
  );
}

export default CardList;
