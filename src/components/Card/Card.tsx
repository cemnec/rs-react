import React from 'react';

import type { Character } from '../../types/character';

interface Props {
  character: Character;
}

class Card extends React.Component<Props> {
  render(): React.ReactNode {
    const { character } = this.props;

    return (
      <article className="card">
        <img src={character.image} alt={character.name} width="120" />
        <h2>{character.name}</h2>
        <p>{character.species}</p>
        <p>{character.status}</p>
      </article>
    );
  }
}

export default Card;
