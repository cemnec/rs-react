import React from 'react';

import type { Character } from '../../types/character';
import Card from '../Card';

interface Props {
  characters: Character[];
}

class CardList extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <section className="card-list">
        {this.props.characters.map((character) => (
          <Card key={character.id} character={character} />
        ))}
      </section>
    );
  }
}

export default CardList;
